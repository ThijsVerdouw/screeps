from defs import *

__pragma__('noalias', 'name')
__pragma__('noalias', 'undefined')
__pragma__('noalias', 'Infinity')
__pragma__('noalias', 'keys')
__pragma__('noalias', 'get')
__pragma__('noalias', 'set')
__pragma__('noalias', 'type')
__pragma__('noalias', 'update')

def IdentifyThreats (location):
    """
    Do I own the room?
    Are there enemies in this room?
    Do I have structures to defend my room with?
    Do I have creeps to defend my room with?
    Defend my room with the resources I have.

    If defense has failed, safemode activate.
    If I have no safemode, pray.
    """
    if len(location.controller) > 0:
        if location.controller.my:
            # is there a controller and do I own it:
            hostiles = location.find(FIND_HOSTILE_CREEPS)
            if len(hostiles)>0:
                # there are enemies, identify options:
                location.memory.FightMode = True
                staticDefenses = location.find(FIND_STRUCTURES).filter(lambda s: s.structureType == STRUCTURE_TOWER)
                if len(staticDefenses)>0:
                    # I am able to defend
                    for tower in staticDefenses:
                        # Fire at will!
                        tower.attack(tower.pos.findClosestByRange(hostiles))
                else:
                    # Safe mode time!
                    location.controller.activateSafeMode()
                    pass
            else:
                # No enemies:
                location.memory.FightMode = False
        else:
            # Not my controller.
            pass
