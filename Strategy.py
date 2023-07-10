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
