import harvester
import Strategy
import Expansion
import SpawnManager
# defs is a package which claims to export all constants and some JavaScript objects, but in reality does
#  nothing. This is useful mainly when using an editor like PyCharm, so that it 'knows' that things like Object, Creep,
#  Game, etc. do exist.
from defs import *

# These are currently required for Transcrypt in order to use the following names in JavaScript.
# Without the 'noalias' pragma, each of the following would be translated into something like 'py_Infinity' or
#  'py_keys' in the output file.
__pragma__('noalias', 'name')
__pragma__('noalias', 'undefined')
__pragma__('noalias', 'Infinity')
__pragma__('noalias', 'keys')
__pragma__('noalias', 'get')
__pragma__('noalias', 'set')
__pragma__('noalias', 'type')
__pragma__('noalias', 'update')


def main():
    """
    Main game logic loop.
    """

    # Identify all living creeps: (should be improved by storing their ID's in memory and by removing or adding when spawning or dying.)
    # Current cost is about 2-3 cpu per cycle, so pretty big and pretty inefficient.
    Schutzstaffel = {'JackOfAllTrades' : [],
                    'Builder' : [],
                    'Miner' : [],
                    'Transporter' : [],
                    'Reichsprotektor': [],
                    'Gefreiter': [],
                    'Templar':[]
                    }

    for name in Object.keys(Game.creeps):
        creep = Game.creeps[name]
        Schutzstaffel[creep.memory.designation].append(creep)

    # Identify total number of living minions per role:
    totalReichsprotektors = len(Schutzstaffel['Reichsprotektor'])
    totalTransporters = len(Schutzstaffel['Transporter'])
    totalBuilders = len(Schutzstaffel['Builder'])
    totalJacks = len(Schutzstaffel['JackOfAllTrades'])
    totalMiners = len(Schutzstaffel['Miner'])
    totalGefreiters = len(Schutzstaffel['Gefreiter'])
    # print('R:' + str(totalReichsprotektors) + ' - T:' + str(totalTransporters) +' - B:' + str(totalBuilders) +' - J:' + str(totalJacks) +' - M:' + str(totalMiners))

    # Manage each room - to be executed every 100 or so game ticks in the future.
    for location in Object.keys(Game.rooms):
        # determine if building (to be done each tick)

        Strategy.IsRoomBuilding(Game.rooms[location])

        #  to be executed every 100 or so game ticks in the future.
        Strategy.DetermineGamePhase (Game.rooms[location])
        Strategy.ConstructRoom(Game.rooms[location])

        # to be executed once per room !!per game!!:
        Strategy.RoomEnergyIdentifier (Game.rooms[location])

        # Executed every 1000 ticks:
        Expansion.ExpansionManager (Game.rooms[location] ,Schutzstaffel['Gefreiter'])

    # Run each creep
    try:
        if totalJacks > 0:
            for creep in Schutzstaffel['JackOfAllTrades']:
                harvester.JackOfAllTrades(creep)
        if totalBuilders > 0:
            for creep in Schutzstaffel['Builder']:
                harvester.Run_Builder(creep)
        if totalMiners > 0 and totalTransporters > 0:
            for creep in Schutzstaffel['Miner']:
                harvester.Run_miner(creep)
        elif totalMiners > 0:
            for creep in Schutzstaffel['Miner']:
                harvester.JackOfAllTrades(creep)
        if totalTransporters > 0:
            for creep in Schutzstaffel['Transporter']:
                harvester.Run_Hauler(creep)
        if totalGefreiters > 0:
            for creep in Schutzstaffel['Gefreiter']:
                Expansion.scout(creep)
        if totalReichsprotektors > 0:
            for creep in Schutzstaffel['Reichsprotektor']:
                harvester.Run_Reichsprotektor(creep)
    except Exception as e:
        print('Error while running harvesters: ' + str(e))

    # Run each spawn
    try:
        for name in Object.keys(Game.spawns):
            spawn = Game.spawns[name]
            if not spawn.spawning:


                # If all creeps have died for some reason:
                if (totalJacks + totalMiners) == 0:
                    creep_name = 'Emergency_' + str(Game.time)
                    modules = [WORK, WORK, CARRY, MOVE]
                    print("Emergency spawn triggered!! ", spawn.spawnCreep(modules, creep_name, memory= {"designation":"JackOfAllTrades"}))
                    print("for creep: ", modules, creep_name)

                # print (totalBuilders, spawn.room.memory.buildersNeeded)
                if spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable:
                    # Identify required number of minions for the room
                    Strategy.IdentifyMinionsNeeded(spawn.room)
                    if totalMiners == 0:
                        SpawnManager.SpawnMiner(spawn)
                    elif totalTransporters == 0:
                        SpawnManager.SpawnTransporter(spawn)
                    elif totalMiners < spawn.room.memory.requiredHarvesters:
                        if totalTransporters < (totalMiners * 0.5) and totalTransporters < spawn.room.memory.transportersNeeded:
                            SpawnManager.SpawnTransporter(spawn)
                        else:
                            SpawnManager.SpawnMiner(spawn)
                    elif totalTransporters < spawn.room.memory.transportersNeeded:
                        SpawnManager.SpawnTransporter(spawn)
                    elif totalBuilders < spawn.room.memory.buildersNeeded:
                        SpawnManager.SpawnBuilder(spawn)
                    elif totalReichsprotektors < spawn.room.memory.upgradersNeeded:
                        SpawnManager.SpawnReichsprotektor(spawn)
                    # elif totalReichsprotektors < spawn.room.memory.buildersNeeded:
                    #     SpawnManager.SpawnReichsprotektor(spawn)

                if spawn.room.memory.scoutNeeded == True:
                    SpawnManager.SpawnScout(spawn)

    except Exception as e:
        print('Error while handling spawns: ' + str(e))


                # else:
                #     print("Awaiting resources for spawning")
            # else:
                # do nothing

module.exports.loop = main
