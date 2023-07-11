from defs import *

__pragma__('noalias', 'name')
__pragma__('noalias', 'undefined')
__pragma__('noalias', 'Infinity')
__pragma__('noalias', 'keys')
__pragma__('noalias', 'get')
__pragma__('noalias', 'set')
__pragma__('noalias', 'type')
__pragma__('noalias', 'update')


def run_harvester(creep):
    """
    Runs a creep as a generic harvester.
    Current issues: Creep memory does not get removed after creep death
                    Creep target is kind of shit, but better than before
                    Creeps are not linked to one specific mine

                    This error pops up every once a while:
                    TypeError: Cannot read property 'pos' of undefined
                    at RoomPosition.inRangeTo (<runtime>:14512:20)
                    at Object.run_harvester (main:1067:29)
                    at Object.main (main:1156:13)
                    at __mainLoop:1:52
                    at __mainLoop:2:3
                    at Object.exports.evalCode (<runtime>:15851:76)
                    at Object.exports.run (<runtime>:46474:24)
    :param creep: The creep to run
    """

    # If we're full, stop filling up and remove the saved source
    if creep.memory.filling and _.sum(creep.carry) >= creep.carryCapacity:
        creep.memory.filling = False
        del creep.memory.source
    # If we're empty, start filling again and remove the saved target
    elif not creep.memory.filling and creep.carry.energy <= 0:
        creep.memory.filling = True
        creep.memory.job = 'Mine'
        del creep.memory.target

    if creep.memory.filling:
        # If we have a saved source, use it
        if creep.memory.source:
            source = Game.getObjectById(creep.memory.source)
        else:
            # Get a random new source and save it
            source = _.sample(creep.room.find(FIND_SOURCES))
            creep.memory.source = source.id

        # If we're near the source, harvest it - otherwise, move to it.
        if creep.pos.isNearTo(source):
            result = creep.harvest(source)
            if result != OK:
                print("[{}] Unknown result from creep.harvest({}): {}".format(creep.name, source, result))
        else:
            creep.moveTo(source)
    else:
        # If we have a saved target, use it
        if len(creep.memory.target)>0:
            target = Game.getObjectById(creep.memory.target)
        else:
            # Get a building site and build it
            # print('Creep room phase: ' + str(creep.room.GamePhase) + ', roomname: ' + str (Game.rooms[creep.room.name]) + str(creep.room.name) )
            if creep.room.memory.GamePhase == 'GameStart':
                # First check if the spawns or extensions are empty:
                target = _(creep.room.find(FIND_STRUCTURES)) \
                    .filter(lambda s: (s.structureType == STRUCTURE_SPAWN or s.structureType == STRUCTURE_EXTENSION)
                                       and s.energy < s.energyCapacity) \
                    .sample()
                if len(target) >0 :
                    creep.memory.target = target.id
                    creep.memory.job = 'Replenish'

                # If the spawns and extensions are full, build:
                elif len(creep.room.find(FIND_CONSTRUCTION_SITES)) >0 :
                    target = _(creep.room.find(FIND_CONSTRUCTION_SITES)) \
                        .filter(lambda s: (s.structureType != STRUCTURE_SPAWN and s.progress >-1)) \
                        .sample()
                    creep.memory.target = target.id
                    creep.memory.job = 'Build'

                # Upgrade the controller
                else:
                    # print('Creep is to be assigned the upgrader class', + str(creep.room.controller.id))
                    creep.memory.target = creep.room.controller.id
                    creep.memory.job = 'Upgrade'


        # print('Target progress: ' + str(target.structureType))
        # If we are targeting a spawn or extension, we need to be directly next to it - otherwise, we can be 3 away.
        if creep.memory.job == 'Upgrade':
            is_close = creep.pos.inRangeTo(target, 3)
        else:
            is_close = creep.pos.isNearTo(target)

        if is_close:
            # If we are targeting a spawn or extension, transfer energy. Otherwise, use upgradeController on it.
            if target.energyCapacity:
                result = creep.transfer(target, RESOURCE_ENERGY)
                if result == OK or result == ERR_FULL:
                    del creep.memory.target
                else:
                    print("[{}] Unknown result from creep.transfer({}, {}): {}".format(
                        creep.name, target, RESOURCE_ENERGY, result))
            elif target.structureType == 'controller':
                result = creep.upgradeController(target)
                if result != OK:
                    print("[{}] Unknown result from creep.upgradeController({}): {}".format(
                        creep.name, target, result))
                # Let the creeps get a little bit closer than required to the controller, to make room for other creeps.
                if not creep.pos.inRangeTo(target, 2):
                    creep.moveTo(target)
            else:
                result = creep.build(target)
        else:
            result = creep.moveTo(target)
            if result == -7:
                print('Creep - ' + str(creep.name) + ' attempted to path to an invalid target. Removing memory.')
                print('Creep - ' + str(creep.name) + ' target was: ' + str(creep.memory.target) + ' and role ' + str(creep.memory.job))
                del creep.memory.target

def create_max_work (room_capacity):
    modules = []

    # Starter chump:
    if room_capacity == 300:
        modules = [WORK, WORK, CARRY, MOVE]

    # If we have 1 or more extensions:
    room_capacity = room_capacity - 150
    for i in range(int(room_capacity/100)): #int rounds down
        modules.append(WORK)
    modules.append(CARRY)
    modules.append(MOVE)
    modules.append(MOVE)

    return modules

def create_balanced (room_capacity):
    modules = []

    # Starter chump:
    if room_capacity == 300:
        modules = [WORK, WORK, CARRY, MOVE]

    # If we have 1 or more extensions:
    # each full set of parts costs 1 work = 100 + 1 move = 50 + 1 carry = 50, sum = 200.
    full_sets = int(room_capacity/200)
    for i in range(int(room_capacity/200)): #int rounds down
        modules.append(WORK)
        modules.append(CARRY)
        modules.append(MOVE)
    # If we can slap another free move and carry on this bad boi, do so.
    if (room_capacity - (full_sets * 200)) >=100:
        modules.append(CARRY)
        modules.append(MOVE)
    modules.sort()
    # print ('Debug log - ', room_capacity, full_sets, modules)
    return modules
