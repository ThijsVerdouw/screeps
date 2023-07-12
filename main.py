import harvester
import Strategy
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
    # Manage each room - to be executed every 100 or so game ticks in the future.
    for location in Object.keys(Game.rooms):
        Strategy.DetermineGamePhase (Game.rooms[location])
        Strategy.ManageRoom(Game.rooms[location])

        # to be executed once per !game!:
        Strategy.RoomEnergyIdentifier (Game.rooms[location])

        # Executed every 1000 ticks:
        Strategy.identifyHarvestersNeeded (Game.rooms[location])
        # print(Game.rooms[location])


    # Run each creep
    for name in Object.keys(Game.creeps):
        creep = Game.creeps[name]
        harvester.run_harvester(creep)

    # Run each spawn
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
                    print("Spawning operation status: ", spawn.spawnCreep(optimal_harvester, creep_name))
                    print("for creep: ", optimal_harvester, creep_name)
                elif num_creeps == 0:
                    creep_name = 'Harvester_' + str(Game.time)
                    optimal_harvester = [WORK, WORK, CARRY, MOVE]
                    print("Spawning operation status: ", spawn.spawnCreep(optimal_harvester, creep_name))
                    print("for creep: ", optimal_harvester, creep_name)

                # else:
                #     print("Awaiting resources for spawning")
            # else:
                # do nothing

module.exports.loop = main
