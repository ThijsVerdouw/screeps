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

    controllers = len(location.controller)
    extensions = len(location.find(FIND_STRUCTURES).filter(lambda s: s.structureType == STRUCTURE_EXTENSION))
    containers = len(location.find(FIND_STRUCTURES).filter(lambda s: s.structureType == STRUCTURE_CONTAINER))
    # print (containers, extensions)
    
    
    # not owned by me:
    if controllers > 0:
        if not location.controller.my:
            location.memory.GamePhase = 0 # unused.
            location.memory.building = False

        # The true start of the game, no creeps:
        elif location.controller.level <2:
            location.memory.GamePhase = 1
            location.memory.minersPerAccessPoint = 1
            location.memory.expanding = False
            location.memory.remoteMining = False
            location.memory.scoutNeeded = False
            location.memory.TransportersPerAccesPoint = 2
            location.memory.transportersNeeded = location.memory.TransportersPerAccesPoint  * location.memory.totalAccesPoints
            location.memory.MaxHarversPerSource = 2

        # If at the start of the game and not enough extensions have been made:
        elif extensions <5 or containers <= 2:
            # print((location.find(FIND_STRUCTURES).filter(lambda s: s.structureType == STRUCTURE_EXTENSION)) <5)
            location.memory.GamePhase = 2
            # This needs to trigger building of extensions.
            
            # The reason these are set to the same values as the previous gamephase is to ensure nothing dies when the bot reverts to this gamephase from a higher one.
            location.memory.minersPerAccessPoint = 1
            location.memory.expanding = False
            location.memory.remoteMining = False
            location.memory.scoutNeeded = False
            location.memory.TransportersPerAccesPoint = 2
            location.memory.transportersNeeded = location.memory.TransportersPerAccesPoint  * location.memory.totalAccesPoints
            location.memory.MaxHarversPerSource = 2
            
        elif containers >= len(location.memory.listForSourceData) + 2 and extensions <= 8:
            location.memory.GamePhase = 3
            location.memory.MaxHarversPerSource = 1
            
        elif extensions > 8 and extensions <=41  and containers >= len(location.memory.listForSourceData) + 2:
            # Add filter to ensure the number of rooms < maximum number of rooms.
            location.memory.GamePhase = 4
            location.memory.MaxHarversPerSource = 1
            # location.memory.transportersNeeded =
            # location.memory.minersPerAccessPoint = 1
            location.memory.expanding = False
            location.memory.scoutNeeded = False
            location.memory.remoteMining = True
            if extensions >16:
                location.memory.TransportersPerAccesPoint = 1
                
            else:
                location.memory.TransportersPerAccesPoint = 1.5
            location.memory.transportersNeeded = int(location.memory.TransportersPerAccesPoint  * location.memory.totalAccesPoints)
                
            # location.memory.scoutNeeded = False
            
            # The number of haulers should be calculated with a relatively complicated calculation:
            # trip time = (Distance between source and dropoff point in ticks * 2) + 8). The +8 is time for refill.
            # ticks until miner is full = carrycapacity / (work parts * 2)
            # needed haulers = ticks until miner is full / trip time. Rounded upwards
            # location.memory.transportersNeeded = int(location.memory.requiredHarvesters * 1.5) # (this obviously is a placeholder)
        
        elif extensions >42:
            location.memory.GamePhase = 5
            
        # Prevent weird stuff
        elif containers >= len(location.memory.listForSourceData) + 2:
            location.memory.GamePhase = 3
            location.memory.MaxHarversPerSource = 1
            # This needs to trigger construction of extensions and containers.
            
        else:
            location.memory.GamePhase = -420 #debug
            # location.memory.minersPerAccessPoint = 1
    else:
        location.memory.GamePhase = -1
        location.memory.building = False

    if location.memory.GamePhase >0:
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
    pass
    # Uses the GamePhase variable to determine the macro-level actions:
    # if location.memory.GamePhase == 'GameStart':
    #     # If not yet building:
    #     if len(location.find(FIND_CONSTRUCTION_SITES)) == 0:
    #         location.createConstructionSite(20, 19, STRUCTURE_EXTENSION)
    #
    # elif location.memory.GamePhase == 'ReadyToRumble' :
    #     if len(location.find(FIND_CONSTRUCTION_SITES)) == 0:
    #         location.createConstructionSite(10, 15, STRUCTURE_CONTAINER)

    # If room already contains the optimal number of extensions:
    # else:
        # print('GamePhase unclear.')
        # pass

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
                if terrain.get(newX,newY) == 0 or terrain.get(newX,newY) == 2:
                # Nice code to disable seeing the source itself, not needed because sources are in walls:
                # and source.pos.x != newX and source.pos.y != newY:
                    # print('Terrain at X: ' + str(newX) + ' Y: ' + str(newY) + ' ' + str(terrain.get (newX, newY)) + ' was considered an access point' )
                    accessPoints = min(accessPoints + 1, location.memory.MaxHarversPerSource)
                    # print('We now have this many access points: ' + str(accessPoints))
        totalAccesPoints = totalAccesPoints + accessPoints
        listForSourceData.append([source.id, accessPoints])
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
        if round(location.memory.totalAccesPoints / 1.5) < 0:
            location.memory.buildersNeeded = 1
        else:
            location.memory.buildersNeeded = round(location.memory.requiredHarvesters / 1.5)
    # If structures need repairs:
    elif len(location.find(FIND_STRUCTURES).filter(lambda s: s.hits < (s.hitsMax * 0.8))) > 0:
        location.memory.buildersNeeded = 1
    else:
        location.memory.buildersNeeded = 0

    # If we are building, upgrading is not a priority.
    if location.memory.building:
        location.memory.upgradersNeeded = 1
    else:
        # The number of promoters is the sum of miners * 2.5. Again, assuming identical work modules (which is likely) and all energy is used for promotion.
        location.memory.upgradersNeeded = int(location.memory.requiredHarvesters * 2 )

    




def assignSameRoomSource (location):
    """
    The aim of this function is to assign a creep to a specific energy source.
    The first step is to identify how many creeps are already assigned to the energy souces,
    and to identify the need for more creeps for that specific source.
    """

    # print(location.memory.sourceAccessability[0],location.memory.sourceAccessability[1],location.memory.sourceAccessability[0][0],location.memory.sourceAccessability[0][1])
    for i in range(len(location.memory.sourceAccessability)):
        source = Game.getObjectById(location.memory.sourceAccessability[i][0])
        requiredCreeps = min(2,location.memory.sourceAccessability[i][1]) * location.memory.minersPerAccessPoint

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
        source = Game.getObjectById(location.memory.sourceAccessability[i][0])
        requiredCreeps =  min(location.memory.MaxHarversPerSource, location.memory.sourceAccessability[i][1]) * location.memory.TransportersPerAccesPoint

        num_creeps = len(location.find(FIND_CREEPS).filter(lambda c: c.memory.PickupPoint == source.id and len(c.memory.PickupPoint)>0))
        print('Source: ', str(source.id) + ', requiredCreeps: ' + str(requiredCreeps) + ' num_creeps ' + str(num_creeps))
        for creepboi in location.find(FIND_CREEPS):
            print(creepboi, creepboi.memory.PickupPoint)

        if num_creeps < requiredCreeps and requiredCreeps > -1: #added requiredCreeps > -1 to prevent undefined.
            print ('assigned source id: ', str(source.id))
            return source.id
        # For remote mining creeps: add elif here to do the same, but with num_creeps = game.creeps.find instead of room.creeps.find

def GetClosestContainer (containers, target, acceptableDistance):
    for container in containers:
        # print('Attempting assing container 'str(container) + ' to target: ' + str(target))
        if container.pos.inRangeTo(target, acceptableDistance):
            result = container.id

    if result == None:
        print('Error in allocating source for: ' + str(target.name))
    return result


def AllocateContainers(location):
    """
    The aim of this code is to allocate one source per potential energy creation/consumption location:
    1 for spawn,
    1 for the controller,
    1 for each source.
    This is to be stored in the memory of the room in order for the haulers to set their targets.
    """
    containers = location.find(FIND_STRUCTURES).filter(lambda s: s.structureType == STRUCTURE_CONTAINER)
    # If there are enough containers:
    if len(containers) >= (2 + len(location.memory.sourceNr)):
        # start allocation:
        sourceContainers = []
        for i in range(len(location.memory.sourceAccessability)):
            # Allocate one container to each source:
            source = Game.getObjectById(location.memory.sourceAccessability[i][0])
            sourceContainers.append(GetClosestContainer (containers, source, 2))

        location.memory.sourceContainers = sourceContainers
        location.memory.controllerContainer = GetClosestContainer (containers, location.controller, 3)
        # This picks a random spawn from the list of spawners in the room. Potential issue when you have >1 spawns. But that'll probably never happen lol.
        spawn = location.find(FIND_MY_SPAWNS)
        if len(spawn) >0:
            spawn = spawn[0]
        else:
            print('Error in finding spawn')
        location.memory.spawnContainer = GetClosestContainer (containers, spawn, 1)







            # Game.getObjectById(creep.room.controller.id)
            # len(location.find(FIND_STRUCTURES).filter(lambda s: s.hits < (s.hitsMax * 0.8)))
