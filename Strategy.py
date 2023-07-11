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
# If at the start of the game and not enough extensions have been made:
    # print('Before logic: ' + str(location.memory.GamePhase) + ' For var: ' + str(location))
    if location.memory.GamePhase == None:
        location.memory.GamePhase = 'Debug'
    elif location.energyCapacityAvailable < 2000:
        location.memory.GamePhase = 'GameStart'
    else:
        location.memory.GamePhase = 'ReadyToRumble'

    # print(location.memory.GamePhase)

def ManageRoom (location):
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
        print('GamePhase unclear.')

def RoomEnergyIdentifier (location):
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
    for source in sources:
        x = (source.pos.x)
        y = (source.pos.y)
        accessPoints = 0

        for xChange in range(3):
            newX = x - xChange + 1
            for yChange in range(3):
                newY = y - yChange + 1
                # terrain = 0 means plains.
                # The and statement here is clunky but it works
                # print('Terrain at X: ' + str(newX) + ' Y: ' + str(newY) + ' ' + str(terrain.get (newX, newY)))
                if terrain.get(newX,newY) == 0 and x != newX and y != newY:
                    # print('Terrain at X: ' + str(newX) + ' Y: ' + str(newY) + ' ' + str(terrain.get (newX, newY)) + ' was considered an access point' )
                    accessPoints = accessPoints + 1
        listForSourceData.append([source, accessPoints])
        # print ('The following source data ')
    location.memory.sourceAccessability = listForSourceData

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
