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
                    Creep target is kind of shit and only targets the controller
                    Creeps are not linked to one specific mine
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
                if result != OK:
                    del creep.memory.target
        else:
            creep.moveTo(target)

def create_optimal (room_capacity):
    optimal_harvester = []

    # Starter chump:
    if room_capacity == 300:
        optimal_harvester = [WORK, WORK, CARRY, MOVE]

    # If we have 1 or more extensions:
    room_capacity = room_capacity - 150
    for i in range(int(room_capacity/100)): #int rounds down
        optimal_harvester.append(WORK)
    optimal_harvester.append(CARRY)
    optimal_harvester.append(MOVE)
    optimal_harvester.append(MOVE)
    return optimal_harvester
