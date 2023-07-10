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
                # picks a random construction site (random as in, there is always one.)
                # print(creep.room.FIND_CONSTRUCTION_SITES)
                # print(creep.room.FIND_CONSTRUCTION_SITES.sample())
                # target = creep.room.find(FIND_CONSTRUCTION_SITES)
                target = _(creep.room.find(FIND_CONSTRUCTION_SITES)) \
                    .filter(lambda s: (s.structureType != STRUCTURE_SPAWN and s.progress >-1)) \
                    .sample()
                print(target)
            else:
                # Get a random new target.
                target = _(creep.room.find(FIND_STRUCTURES)) \
                    .filter(lambda s: ((s.structureType == STRUCTURE_SPAWN or s.structureType == STRUCTURE_EXTENSION)
                                       and s.energy < s.energyCapacity) or s.structureType == STRUCTURE_CONTROLLER) \
                    .sample()
                # print('Taret is an object for controller test; ' + str(target.pos))
                creep.memory.target = target.id


        # print('Target progress: ' + str(target.structureType))
        # If we are targeting a spawn or extension, we need to be directly next to it - otherwise, we can be 3 away.
        if target.structureType == 'controller':
            is_close = creep.pos.inRangeTo(target, 3)
        elif target.structureType == 'spawn' :
            is_close = creep.pos.isNearTo(target)

        # If construction site:
        else :
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
            creep.moveTo(target)

def create_optimal (room_capacity):
    optimal_harvester = []
    room_capacity = room_capacity - 150
    for i in range(int(room_capacity/100)): #int rounds down
        optimal_harvester.append(WORK)
    optimal_harvester.append(CARRY)
    optimal_harvester.append(MOVE)
    optimal_harvester.append(MOVE)
    return optimal_harvester
