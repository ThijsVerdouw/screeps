from defs import *

__pragma__('noalias', 'name')
__pragma__('noalias', 'undefined')
__pragma__('noalias', 'Infinity')
__pragma__('noalias', 'keys')
__pragma__('noalias', 'get')
__pragma__('noalias', 'set')
__pragma__('noalias', 'type')
__pragma__('noalias', 'update')

def SpawnCreep (spawn, name, modules, Memory):
    '''
    I'm not sure what to put here. The spawning happens based on modules and hardcoded pieces of memory.
    '''
    if spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable:
        result = spawn.spawnCreep(modules, name, memory= Memory)
        print("Spawning operation status: ", spawn.spawnCreep(modules, name, memory= Memory))
        print("for creep: ", modules, name)

def SpawnJackOfAllTrades(spawn):
    creep_name = 'Jack_' + str(Game.time)
    modules = create_balanced(spawn.room.energyCapacityAvailable)
    Memory = {'designation':'JackOfAllTrades'}
    SpawnCreep(spawn, creep_name, modules, Memory)

def SpawnScout (spawn):
    '''
    Spawning scouts is something which happens occasionally, its not included in the standard room management framework.
    The room requests them, so this code has to set the spawn.room.memory.scoutNeeded to False at the end of the code.
    '''
    if spawn.room.energyAvailable >= 50:
        creep_name = 'Franz_' + str(Game.time)
        modules = [MOVE]
        result = spawn.spawnCreep(spawn, modules, creep_name, memory= {"designation":"Gefreiter"})
        print("Spawning operation status: ", result)
        print("for creep: ", modules, creep_name)
        if result == 0:
            spawn.room.memory.scoutNeeded = False

def SpawnBuilder(spawn):
    creep_name = 'Bob_' + str(Game.time)
    modules = create_balanced(spawn.room.energyCapacityAvailable)
    Memory = {'designation':'Builder'}
    SpawnCreep(spawn, creep_name, modules, Memory)

def SpawnTransporter(spawn):
    creep_name = 'Transporter_' + str(Game.time)
    if spawn.room.memory.GamePhase <3:
        modules = create_transporter(spawn.room.energyCapacityAvailable)
    else:
        modules = create_midgame_transporter(spawn.room.energyCapacityAvailable)
    Memory = {'designation':'Transporter'}
    SpawnCreep(spawn, creep_name, modules, Memory)

def SpawnMiner(spawn):
    creep_name = 'Simon_' + str(Game.time)
    # print (spawn.room.energyAvailable);
    if spawn.room.memory.GamePhase <3:
        modules = create_miner(spawn.room.energyCapacityAvailable)
    else:
        modules = create_midgame_miner(spawn.room.energyCapacityAvailable)
    Memory = {'designation':'Miner'}
    SpawnCreep(spawn, creep_name, modules, Memory)

def SpawnReichsprotektor (spawn):
    creep_name = 'Konstantin_' + str(Game.time)
    modules = create_miner(spawn.room.energyCapacityAvailable)
    Memory = {'designation':'Reichsprotektor'}
    SpawnCreep(spawn, creep_name, modules, Memory)


def create_midgame_transporter (room_capacity):
    """
    Effectively the same creep as the early game version, but this one assumes we have roads.
    """
    modules = []
    full_sets = int(room_capacity/150)
    for i in range(full_sets): #int rounds down
        modules.append(CARRY)
        modules.append(CARRY)
        modules.append(MOVE)
    if (room_capacity - (full_sets * 150)) == 100:
        modules.append(MOVE)
        modules.append(CARRY)
    modules.sort()
    
def create_transporter(room_capacity):
    modules = []
    if room_capacity == 300:
        modules = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    else:
        # The amount of carry = amount of carry on a miner * 2
        # each full set of parts costs 2 move = 100 + 2 carry = 100, sum = 200.
        # But these are adjusted to miner carry *2, so I'm only spending 200 per 300 available energy.
        full_sets = int(room_capacity/100)
        for i in range(int(room_capacity/100)): #int rounds down
            modules.append(CARRY)
            modules.append(MOVE)

    modules.sort()
    return modules

def create_midgame_miner(room_capacity):
    modules = []
    room_capacity = room_capacity - 100
    # The Thijs-miner is 6 work, 1 carry 1 move
    full_sets = min(int(room_capacity/100),6)
    for i in range(full_sets): #int rounds down
        modules.append(WORK)
    modules.append(CARRY)
    modules.append(MOVE)
    modules.sort()
    return modules

def create_miner (room_capacity):
    modules = []

    # Starter chump:
    if room_capacity == 300:
        modules = [WORK, WORK, CARRY, MOVE]
    else:
        # If we have 1 or more extensions:
        # each full set of parts costs 2 work = 200 + 1 move = 50 + 1 carry = 50, sum = 300.
        full_sets = int(room_capacity/300)
        for i in range(int(room_capacity/300)): #int rounds down
            modules.append(WORK)
            modules.append(WORK)
            modules.append(CARRY)
            modules.append(MOVE)
        # If we can slap another free carry and carry on this bad boi, do so.
        if (room_capacity - (full_sets * 300)) >=200:
            modules.append(WORK)
            modules.append(MOVE)
            modules.append(CARRY)
    modules.sort()
    return modules

def create_balanced (room_capacity):
    modules = []

    # Starter chump:
    if room_capacity == 300:
        modules = [WORK, CARRY, CARRY, MOVE, MOVE]
    else:
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
