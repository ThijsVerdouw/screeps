import harvester
import Strategy
import Expansion
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
                    'Reichsprotektor': []}

    for name in Object.keys(Game.creeps):
        creep = Game.creeps[name]
        Schutzstaffel[creep.memory.designation].append(creep)

    # Manage each room - to be executed every 100 or so game ticks in the future.
    for location in Object.keys(Game.rooms):
        Strategy.DetermineGamePhase (Game.rooms[location])
        Strategy.ConstructRoom(Game.rooms[location])

        # to be executed once per !game!:
        Strategy.RoomEnergyIdentifier (Game.rooms[location])

        # Executed every 1000 ticks:
        Strategy.identifyHarvestersNeeded (Game.rooms[location])
        Expansion.ExpansionManager (Game.rooms[location] ,Schutzstaffel['Reichsprotektor'])
        # print(Game.rooms[location])


    # Run each creep
    try:

        for creep in Schutzstaffel['JackOfAllTrades']:
            harvester.run_harvester(creep)
        for creep in Schutzstaffel['Reichsprotektor']:
            Expansion.scout(creep)



    except Exception as e:
        print('Error while running harvesters: ' + str(e))

    # Run each spawn
    try:
        for name in Object.keys(Game.spawns):
            spawn = Game.spawns[name]
            if not spawn.spawning:
                # Get the number of our creeps in the room.
                num_creeps = _.sum(Game.creeps, lambda c: c.pos.roomName == spawn.pos.roomName)

                # If we do not have enough bois to mine (calculated on a room-level)
                if num_creeps < spawn.room.memory.requiredHarvesters:
                    # If we can afford a boi:
                    if spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable:
                        creep_name = 'Harvester_' + str(Game.time)

                        # Temporary place for this optimal harvester code, want to have this in memory.
                        optimal_harvester = harvester.create_balanced(spawn.room.energyCapacityAvailable)
                        print("Spawning operation status: ", spawn.spawnCreep(optimal_harvester, creep_name, memory= {"designation":"JackOfAllTrades"}))
                        print("for creep: ", optimal_harvester, creep_name)

                    elif num_creeps == 0:
                        creep_name = 'Harvester_' + str(Game.time)
                        modules = [WORK, WORK, CARRY, MOVE]
                        print("Spawning operation status: ", spawn.spawnCreep(modules, creep_name, memory= {"designation":"JackOfAllTrades"}))
                        print("for creep: ", modules, creep_name)

                elif spawn.room.memory.scoutNeeded == True and spawn.room.energyAvailable >= 50:
                    creep_name = 'Konstantin' + str(Game.time)
                    modules = [MOVE]
                    result = spawn.spawnCreep(modules, creep_name, memory= {"designation":"Reichsprotektor"})
                    print("Spawning operation status: ", result)
                    print("for creep: ", modules, creep_name)
                    if result == 0:
                        spawn.room.memory.scoutNeeded = False





    except Exception as e:
        print('Error while handling spawns: ' + str(e))


                # else:
                #     print("Awaiting resources for spawning")
            # else:
                # do nothing

module.exports.loop = main
