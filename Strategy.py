from defs import *

__pragma__('noalias', 'name')
__pragma__('noalias', 'undefined')
__pragma__('noalias', 'Infinity')
__pragma__('noalias', 'keys')
__pragma__('noalias', 'get')
__pragma__('noalias', 'set')
__pragma__('noalias', 'type')
__pragma__('noalias', 'update')


def DetermineGamePhase (location):
    """
    This is the core of the bot: it is supposed to act based on the game phase.
    Act is defined as 'spawn creeps, determine creep job composition, expand, et cetera.'
    It currently is lacking in the following areas:
    1. The game phases are limited
    - we need another game phase for:
    - 'spawning 4-6 jack of all trades and X number of remotes'
    - 'jack of all trades + remotes == desired number' and 'RCL <2' and 'no extensions built'
    - 'jack of all trades == desired number' and 'no containers built'
    - 'containers built'
    - 'containers built' and 'transition to proper minion composition completed'
    - expanding

    I also want the data from memory to be exported using this: https://github.com/screepers/screeps-multimeter
    """
    # print('Before logic: ' + str(location.memory.GamePhase) + ' For var: ' + str(location))

    # not owned by me:
    if len(location.controller) > 0:
        if not location.controller.my:
            location.memory.GamePhase = 'UnUsed'
            location.memory.building = False

        # The true start of the game, no creeps:
        elif location.controller.level <2:
            location.memory.GamePhase = 'T0'
            location.memory.minersPerAccessPoint = 2
            location.memory.expanding = False
            location.memory.remoteMining = False
            location.memory.scoutNeeded = False
            location.memory.TransportersPerAccesPoint = 0.5

        # If at the start of the game and not enough extensions have been made:
        elif _.sum(location.find(FIND_STRUCTURES).filter(lambda s: s.structureType == STRUCTURE_EXTENSION)) <5 and _.sum(location.find(FIND_STRUCTURES).filter(lambda s: s.structureType == STRUCTURE_CONTAINER)) < 2:
            location.memory.GamePhase = 'GameStart'
            location.memory.minersPerAccessPoint = 1
            location.memory.expanding = False
            location.memory.remoteMining = False
            location.memory.scoutNeeded = False
            location.memory.TransportersPerAccesPoint = 0.5

        elif location.controller.level <3:
            location.memory.GamePhase = 'GameStart'
            location.memory.minersPerAccessPoint = 1
            location.memory.expanding = False
            location.memory.remoteMining = False
            location.memory.scoutNeeded = False
            location.memory.TransportersPerAccesPoint = 0.5

        elif _.sum(location.find(FIND_STRUCTURES).filter(lambda s: s.structureType == STRUCTURE_EXTENSION)) >8 and _.sum(location.find(FIND_STRUCTURES).filter(lambda s: s.structureType == STRUCTURE_CONTAINER)) > 1:
            # Add filter to ensure the number of rooms < maximum number of rooms.
            location.memory.GamePhase = 'ReadyToRumble'
            location.memory.minersPerAccessPoint = 2
            location.memory.expanding = True
            location.memory.remoteMining = False
            location.memory.scoutNeeded = False
            location.memory.TransportersPerAccesPoint = 0.5
        else:
            location.memory.GamePhase = 'Debug'
            location.memory.minersPerAccessPoint = 0
    else:
        location.memory.GamePhase = 'UnUsed'
        location.memory.building = False
    location.memory.requiredHarvesters = location.memory.minersPerAccessPoint * location.memory.totalAccesPoints
    # print(location.memory.GamePhase)

def IsRoomBuilding(location):
    if len(location.controller) > 0:
        if location.controller.my:
            if len(location.find(FIND_CONSTRUCTION_SITES)) >0:
                location.memory.building = True
            else:
                location.memory.building = False
        else:
            location.memory.building = False
    else:
        location.memory.building = False


def ConstructRoom (location):
    """
    This function is really nothing more than an empty shell.
    """
    # Uses the GamePhase variable to determine the macro-level actions:
    if location.memory.GamePhase == 'GameStart':
        # If not yet building:
        if len(location.find(FIND_CONSTRUCTION_SITES)) == 0:
            location.createConstructionSite(20, 19, STRUCTURE_EXTENSION)

    elif location.memory.GamePhase == 'ReadyToRumble' :
        if len(location.find(FIND_CONSTRUCTION_SITES)) == 0:
            location.createConstructionSite(10, 15, STRUCTURE_CONTAINER)

    # If room already contains the optimal number of extensions:
    else:
        # print('GamePhase unclear.')
        pass

def RoomEnergyIdentifier (location):
    """
    The aim of this fuction is to identify how many people could theoretically mine at the same time in one room.
    This number is then used to determine the required number of miners at a given point in the game.
    """

    sources = location.find(FIND_SOURCES)
    # print(sources)
    # This contains the number of sources, something to be used for assinging creeps to energy sources
    location.memory.sourceNr = len(sources)

    # Now we have to assess all squares around the energy source
    # If they are walkable terrain, it is a place where a creep can mine (access point)
    listForSourceData = []
    terrain = location.getTerrain();

    # Future enhancement, designate most efficient builder creeps based on distance from spawn / controller.
    # distanceFromSpawn = 9999
    # distanceFromController = 0
    totalAccesPoints = 0 # Entire room
    for source in sources:
        x = (source.pos.x)
        y = (source.pos.y)
        accessPoints = 0 # per source


        for xChange in range(3):
            newX = x - xChange + 1
            for yChange in range(3):
                newY = y - yChange + 1
                # terrain = 0 means plains.
                # The and statement here is clunky but it works
                # print('Terrain at X: ' + str(newX) + ' Y: ' + str(newY) + ' ' + str(terrain.get (newX, newY)))
                if terrain.get(newX,newY) == 0 :
                # Nice code to disable seeing the source itself, not needed because sources are in walls:
                # and source.pos.x != newX and source.pos.y != newY:
                    # print('Terrain at X: ' + str(newX) + ' Y: ' + str(newY) + ' ' + str(terrain.get (newX, newY)) + ' was considered an access point' )
                    accessPoints = accessPoints + 1
        totalAccesPoints = totalAccesPoints + accessPoints
        listForSourceData.append([source, accessPoints])
    # print (listForSourceData)
    location.memory.totalAccesPoints = totalAccesPoints
    location.memory.sourceAccessability = listForSourceData

def IdentifyMinionsNeeded (location):
    """
    The aim of this fuction is to determine the number of needed minions in a room, by using the number of access points of all of the sources as a baseline.
    This number is then used to compare against in Main.py, to determine if new creeps have to be spawned.
    """
    # The number of builders needed is the total number of miners, divided by 2.5. This is assuming all produced energy is used as building materials.
    # This also assume the miners have the same number of work modules as the builders (not the case, probably?)

    if location.memory.building:
        if round(location.memory.totalAccesPoints / 2.5) < 0:
            location.memory.buildersNeeded = 1
        else:
            location.memory.buildersNeeded = round(location.memory.totalAccesPoints / 2.5)
    # If structures need repairs:
    elif len(location.find(FIND_STRUCTURES).filter(lambda s: s.hits < (s.hitsMax * 0.8))) > 0:
        location.memory.buildersNeeded = 1
    else:
        location.memory.buildersNeeded = 0

    # If we are building, upgrading is not a priority.
    if location.memory.building:
        location.memory.upgradersNeeded = 0
    else:
        # The number of promoters is the sum of miners * 2.5. Again, assuming identical work modules (which is likely) and all energy is used for promotion.
        location.memory.upgradersNeeded = round(location.memory.totalAccesPoints * 2 )

    # The number of haulers would be calculated with a relatively complicated calculation:
    # trip time = (Distance between source and dropoff point in ticks * 2) + 8). The +8 is time for refill.
    # ticks until miner is full = carrycapacity / (work parts * 2)
    # needed haulers = ticks until miner is full / trip time. Rounded upwards
    location.memory.transportersNeeded = location.memory.totalAccesPoints * location.memory.TransportersPerAccesPoint # (this obviously is a placeholder)




def assignSameRoomSource (location):
    """
    The aim of this function is to assign a creep to a specific energy source.
    The first step is to identify how many creeps are already assigned to the energy souces,
    and to identify the need for more creeps for that specific source.
    """

    # print(location.memory.sourceAccessability[0],location.memory.sourceAccessability[1],location.memory.sourceAccessability[0][0],location.memory.sourceAccessability[0][1])
    for i in range(len(location.memory.sourceAccessability)):
        source = location.memory.sourceAccessability[i][0]
        requiredCreeps = location.memory.sourceAccessability[i][1] * location.memory.minersPerAccessPoint

        num_creeps = len(location.find(FIND_CREEPS).filter(lambda c: c.memory.source == source.id and len(c.memory.source)>0))
        print('Source: ', str(source.id) + ', requiredCreeps: ' + str(requiredCreeps) + ' num_creeps ' + str(num_creeps))
        for creepboi in location.find(FIND_CREEPS):
            print(creepboi, creepboi.memory.source)

        if num_creeps < requiredCreeps and requiredCreeps > -1: #added requiredCreeps > -1 to prevent undefined.
            print ('assigned source id: ', str(source.id))
            return source.id

        # For remote mining creeps: add elif here to do the same, but with num_creeps = game.creeps.find instead of room.creeps.find

def assignSameRoomPickupPoint (location):
    """
    Same function as above, but for haulers.
    """
    print('attemping to assign source for location')
    for i in range(len(location.memory.sourceAccessability)):
        source = location.memory.sourceAccessability[i][0]
        requiredCreeps = location.memory.sourceAccessability[i][1] * location.memory.TransportersPerAccesPoint

        num_creeps = len(location.find(FIND_CREEPS).filter(lambda c: c.memory.PickupPoint == source.id and len(c.memory.PickupPoint)>0))
        print('Source: ', str(source.id) + ', requiredCreeps: ' + str(requiredCreeps) + ' num_creeps ' + str(num_creeps))
        for creepboi in location.find(FIND_CREEPS):
            print(creepboi, creepboi.memory.PickupPoint)

        if num_creeps < requiredCreeps and requiredCreeps > -1: #added requiredCreeps > -1 to prevent undefined.
            print ('assigned source id: ', str(source.id))
            return source.id
        # For remote mining creeps: add elif here to do the same, but with num_creeps = game.creeps.find instead of room.creeps.find

# example from https://docs.screeps.com/api/#PathFinder for further improvement:
  # let creep = Game.creeps.John;
  #
  # let goals = _.map(creep.room.find(FIND_SOURCES), function(source) {
  #   // We can't actually walk on sources-- set `range` to 1
  #   // so we path next to it.
  #   return { pos: source.pos, range: 1 };
  # });
  #
  # let ret = PathFinder.search(
  #   creep.pos, goals,
  #   {
  #     // We need to set the defaults costs higher so that we
  #     // can set the road cost lower in `roomCallback`
  #     plainCost: 2,
  #     swampCost: 10,
  #
  #     roomCallback: function(roomName) {
  #
  #       let room = Game.rooms[roomName];
  #       // In this example `room` will always exist, but since
  #       // PathFinder supports searches which span multiple rooms
  #       // you should be careful!
  #       if (!room) return;
  #       let costs = new PathFinder.CostMatrix;
  #
  #       room.find(FIND_STRUCTURES).forEach(function(struct) {
  #         if (struct.structureType === STRUCTURE_ROAD) {
  #           // Favor roads over plain tiles
  #           costs.set(struct.pos.x, struct.pos.y, 1);
  #         } else if (struct.structureType !== STRUCTURE_CONTAINER &&
  #                    (struct.structureType !== STRUCTURE_RAMPART ||
  #                     !struct.my)) {
  #           // Can't walk through non-walkable buildings
  #           costs.set(struct.pos.x, struct.pos.y, 0xff);
  #         }
  #       });
  #
  #       // Avoid creeps in the room
  #       room.find(FIND_CREEPS).forEach(function(creep) {
  #         costs.set(creep.pos.x, creep.pos.y, 0xff);
  #       });
  #
  #       return costs;
  #     },
  #   }
  # );
