from defs import *

__pragma__('noalias', 'name')
__pragma__('noalias', 'undefined')
__pragma__('noalias', 'Infinity')
__pragma__('noalias', 'keys')
__pragma__('noalias', 'get')
__pragma__('noalias', 'set')
__pragma__('noalias', 'type')
__pragma__('noalias', 'update')

def ExpansionManager (location, scouts):
    if location.memory.expanding == True:

        # scouts = Object.keys(Game.creeps, lambda c: c.memory.designation == "Reichsprotektor")
        # print('Found scouts: ' +  str(scouts))
        if len(scouts) == 0:
            location.memory.scoutNeeded = True
            print ('Initiated expansionmanager for room: ' +str(location) + '. Requested scout.')


def MoveToTargetRoom (creep, targetRoom):
    print('Attempting to move creep: ' + str(creep) + ' to room: ' + str(targetRoom))
    if creep.memory.route == undefined:
        print('Creep tried to move to a different room without having a route')
        # Finds path to the target room, using https://docs.screeps.com/api/#Game.map.findRoute
        # use https://docs.screeps.com/api/#RoomPosition.findPathTo to move to that rooms controller
        route = Game.map.findRoute(creep.room, targetRoom)
        print ('route = ' + str(route) + str(len(route)))
        creep.memory.route = route
        creep.memory.exit = 0

    elif len(creep.memory.route) == 1:
        print('pathing to thing')
        target = creep.pos.findClosestByRange(creep.memory.route[0].exit)
        result = creep.moveTo(target)
        if result == -7:
            print('Scout wanted to move to an invalid target: ' + str(creep))

    elif creep.room == creep.memory.route[creep.memory.exit]:
        creep.memory.exit = creep.memory.exit + 1
        print('Now heading to room '+ route[creep.memory.exit].room);

    else:
        target = creep.pos.findClosestByRange(route[creep.memory.exit].exit)
        creep.moveTo(target)

def scout (creep):
    # use game.map to find the desired room.
    targetRoom = 'W6N8'
    if creep.room.name != targetRoom:
        MoveToTargetRoom (creep, targetRoom)

    else:
        target = Game.getObjectById(creep.room.controller.id)
        if creep.pos.isNearTo(target) == False:
            creep.moveTo(target)

def crusadeToUnclaimedController (creep):
    pass

            # References broken due to this coming from spawn
            # If it is time to spawn the next generation of divine conquerers (expand to a new room):

            # if spawn.room.memory.expanding == True and spawn.room.memory.livingGod == False:
            #     creep_name = 'UberCommandant_' + str(Game.time)
            #     modules = [CLAIM, MOVE]
            #     spawn = location.spawn
            #     result = spawn.spawnCreep(modules, creep_name, memory= {"designation":"Test"})
            #     if result == 0:
            #         print("Spawning operation status: ", result)
            #         spawn.room.memory.livingGod = True

            # Manage claimers:
            # if location.memory.livingGod == True:
            #     for name in Object.keys(Game.creeps, lambda c: c.memory.designation == "Test"):
            #         creep = Game.creeps[name]
            #         Expansion.crusadeToUnclaimedController(creep)

            # Manage scouts:
