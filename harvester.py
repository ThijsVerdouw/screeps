import Strategy
from defs import *

__pragma__('noalias', 'name')
__pragma__('noalias', 'undefined')
__pragma__('noalias', 'Infinity')
__pragma__('noalias', 'keys')
__pragma__('noalias', 'get')
__pragma__('noalias', 'set')
__pragma__('noalias', 'type')
__pragma__('noalias', 'update')

def CollectEnergyIfneeded (creep):
    # If we're full, stop filling up and remove the saved source
    if creep.memory.filling and _.sum(creep.carry) >= creep.carryCapacity:
        creep.memory.filling = False

    # If we're empty, start filling again and remove the saved target
    elif not creep.memory.filling and creep.carry.energy <= 0:
        creep.memory.filling = True
        del creep.memory.target
        del creep.memory.job



def Mine(creep):
    # If we have a saved source, use it
    if creep.memory.source:
        source = Game.getObjectById(creep.memory.source)
    else:
        # get assigned a source by the room manager:
        creep.memory.source = Strategy.assignSameRoomSource(creep.room)

    # If we're near the source, harvest it - otherwise, move to it.
    if creep.pos.isNearTo(source):
        result = creep.harvest(source)
        if result != OK and result != -6:
            print("[{}] Unknown result from creep.harvest({}): {}".format(creep.name, source, result))
    else:
        creep.moveTo(source)

def FindRefillTarget(creep):
    towers = creep.room.find(FIND_STRUCTURES).filter(lambda s: (s.structureType == STRUCTURE_TOWER) and s.energy < s.energyCapacity)
    structs = creep.room.find(FIND_STRUCTURES).filter(lambda s: (s.structureType == STRUCTURE_SPAWN or s.structureType == STRUCTURE_EXTENSION) and s.energy < s.energyCapacity)
    if len(towers)>0:
        structs = towers
    else:
        pass
    if len(structs) >0 :
        # if there is a path to the target
        try:
            a = creep.pos.findClosestByPath(structs).id
            creep.memory.target = a
            target = Game.getObjectById(a)
            creep.memory.job = 'Replenish'

            # Target identified, now act on it:
            # Replenish(creep, target)
            return True
        except Exception as e:
            print ('No path to target for creep: ', creep.name)
            return False

    else:
        return False

def FindBuildTarget(creep):
    # print ('Attempting to find construction sites ', creep.name)
    structs = creep.room.find(FIND_CONSTRUCTION_SITES)
    # print (structs)
    if structs != None and creep.pos.findClosestByPath(structs) != None:
        # if there is a path to the target
        a = creep.pos.findClosestByPath(structs).id
        creep.memory.target = a
        target = Game.getObjectById(a)
        creep.memory.job = 'Build'
        # Target identified, now act on it:
        # Build(creep, target)
        return True
    else:
        print ('No path to target for creep: ', creep.name)
        return False

def FindUpgradeTarget(creep):
    creep.memory.target = creep.room.controller.id
    target = Game.getObjectById(creep.room.controller.id)
    creep.memory.job = 'Upgrade'
    # Target identified, now act on it:
    Upgrade(creep, target)

def setTarget_JackOfAllTrades (creep):
    '''
    This gets the target by looking at the potential targets in order of priority.
    This target is later used to move to and act upon.
    '''
    # If we have a saved target, use it
    if len(creep.memory.target)>0:
        target = Game.getObjectById(creep.memory.target)
    elif FindRefillTarget(creep):
        # print('Creep ' + str(creep.memory.target) + ' is refilling')
        pass
    elif FindBuildTarget(creep):
        # print('Creep ' + str(creep.memory.target) + ' is building')
        pass
    else:
        FindUpgradeTarget(creep)

def CreepMove (creep, target):
    result = creep.moveTo(target)
    if result == -7:
        print('Creep - ' + str(creep.name) + ' attempted to path to an invalid target. Removing memory.')
        print('Creep - ' + str(creep.name) + ' target was: ' + str(creep.memory.target) + ' and role ' + str(creep.memory.job))
        del creep.memory.target

def Replenish(creep, target):
    amountToBeDeposited = _.sum(creep.carry)
    roomAvailable = target.store.getFreeCapacity
    amountToBeDeposited = min(amountToBeDeposited, roomAvailable)
    result = creep.transfer(target, RESOURCE_ENERGY, amountToBeDeposited)
    if result == -7 or result == -10:
        print("[{}] Unknown result from creep.transfer({}, {}): {}".format(
            creep.name, target, RESOURCE_ENERGY, result))
        del creep.memory.target
    else:
        del creep.memory.target

def Build(creep, target):
    result = creep.build(target)
    if result == -7:
        print('Builder ' + str(creep) + ' tried to build an invalid target')
        del creep.memory.target

def Repair(creep, target):
    result = creep.repair(target)
    if result == -7:
        print('Builder ' + str(creep) + ' tried to repair an invalid target')
        del creep.memory.target

    # If repaired:
    elif target.hits > (target.hitsMax * 0.99):
        del creep.memory.target

def Upgrade(creep, target):
    result = creep.upgradeController(target)
    if result != OK:
        print("[{}] Unknown result from creep.upgradeController({}): {}".format(
            creep.name, target, result))
    # Let the creeps get a little bit closer than required to the controller, to make room for other creeps.
    if not creep.pos.inRangeTo(target, 2):
        creep.moveTo(target)

def JackOfAllTrades(creep):
    '''
    This is the basic creep running framework, it works in this order:
    1. check if you have energy.
    1b. If you do not have energy, get it. (by mining or by withdrawing from storage/other creeps. Chosen method depends on the type of creep.)
    2. Check if you have a target.
    2b. If you do not have a target, get one from the list of possible targets.
    3. Check if you are in range of your target.
    3b. If you are not in range of your target, move to your target.
    4. Perform the action related to your target (build building, upgrade controller, refill energy, etc)
    4b. If the target is invalid for some reason, delete the target and start from 2.
    '''
    CollectEnergyIfneeded(creep)
    if creep.memory.filling:
        # print('Creep ' + str(creep) + ' is filling')
        Mine(creep)
    elif len(creep.memory.target)>0:
        target = Game.getObjectById(creep.memory.target)
        if target == None:
            del creep.memory.target
        else:
            # print('Creep ' + str(creep.memory.target) + ' has a target' + str(creep.pos) + str(target) + str(target.pos))

            if creep.memory.job == 'Upgrade' or creep.memory.job == 'Build':
                is_close = creep.pos.inRangeTo(target, 3)
            else:
                is_close = creep.pos.isNearTo(target)

            # print('Creep ' + str(creep) + ' is close to the target: ' + str(is_close))
            if is_close:
                if creep.memory.job == 'Replenish':
                    # print('Creep ' + str(creep) + ' attempts to replenish')
                    Replenish(creep, target)
                elif creep.memory.job == 'Build':
                    # print('Creep ' + str(creep) + ' attempts to build')
                    Build(creep, target)
                else:
                    # print('Creep ' + str(creep) + ' attempts to upgrade')
                    Upgrade(creep, target)
            else:
                CreepMove(creep, target)

    else:
        setTarget_JackOfAllTrades(creep)

############################################################# End of Jack of all trades ####################################################################
################################################################# Start of Builder #########################################################################

def collectFromLogisticsBoi (creep):
    '''
    This method of getting energy is simply: move to the current energy dropoff point and wait for someone to hand you some.
    '''

    if creep.room.memory.building and creep.memory.designation != 'Reichsprotektor':
        if len(creep.memory.spawn) > 0:
            dropoffPoint = Game.getObjectById(creep.memory.spawn)
        else:
            for name in Object.keys(Game.spawns):
                spawn = Game.spawns[name]
                if spawn.room.name == creep.room.name:
                    creep.memory.spawn = spawn.id
                    dropoffPoint = spawn

        appropriateDistance = 2
    else:
        dropoffPoint = creep.room.controller
        appropriateDistance = 4

    # If near spawn, wait for someone to hand you energy.
    if creep.pos.inRangeTo(dropoffPoint, appropriateDistance):
        creep.memory.AwaitingRefill = True
        creep.room.memory.builderAwaitingRefill = True
    else:
        CreepMove(creep, dropoffPoint)

def FindRepairTarget (creep):
    # a structure is in need of repair if it is below 80% HP:
    structs = creep.room.find(FIND_STRUCTURES).filter(lambda s: s.hits < (s.hitsMax * 0.8))
    if len(structs) >0 :
        # if there is a path to the target
        try:
            a = creep.pos.findClosestByPath(structs).id
            creep.memory.target = a
            creep.memory.job = 'Repair'
            return True
        except Exception as e:
            print ('No path to target for creep: ', creep.name)
            return False

def setTarget_Builder (creep):
    '''
    This gets the target by looking at the potential targets in order of priority.
    This target is later used to move to and act upon.
    '''
    # If we have a saved target, use it
    if len(creep.memory.target)>0:
        target = Game.getObjectById(creep.memory.target)
    elif FindBuildTarget(creep):
        # print('Creep ' + str(creep.memory.target) + ' is building')
        pass
    elif FindRepairTarget(creep):
        # print('Creep ' + str(creep.memory.target) + ' is repairing')
        pass
    else:
        FindUpgradeTarget(creep)

def Run_Builder(creep):
    '''
    This is the basic creep running framework, it works in this order:
    1. check if you have energy.
    1b. If you do not have energy, get it. (by mining or by withdrawing from storage/other creeps. Chosen method depends on the type of creep.)
    2. Check if you have a target.
    2b. If you do not have a target, get one from the list of possible targets.
    3. Check if you are in range of your target.
    3b. If you are not in range of your target, move to your target.
    4. Perform the action related to your target (build building, upgrade controller, refill energy, etc)
    4b. If the target is invalid for some reason, delete the target and start from 2.
    '''

    CollectEnergyIfneeded(creep)
    if creep.memory.filling:
        # print('Creep ' + str(creep) + ' is filling')
        collectFromLogisticsBoi(creep)
    elif len(creep.memory.target)>0:
        target = Game.getObjectById(creep.memory.target)

        # If construction was already finished, it refers to a NONEXISTING construction site.
        if target is None:
            del creep.memory.target

        # Ductape fix:
        if creep.memory.AwaitingRefill:
            creep.memory.AwaitingRefill = False
        # print('Creep ' + str(creep) + ' is close to the target: ' + str(creep.pos.inRangeTo(target, 3)))
        if creep.pos.inRangeTo(target, 3):
            if creep.memory.job == 'Build':
                # print('Creep ' + str(creep) + ' attempts to build')
                Build(creep, target)
            elif creep.memory.job == 'Repair':
                # print('Creep ' + str(creep) + ' attempts to Repair')
                Repair(creep, target)
            else:
                # print('Creep ' + str(creep) + ' attempts to upgrade')
                Upgrade(creep, target)
        else:
            CreepMove(creep, target)

    else:
        setTarget_Builder(creep)

############################################################# End of Jack of all trades ####################################################################

def Run_Builder_midgame(creep):
    '''
    This is the basic creep running framework, it works in this order:
    1. check if you have energy.
    1b. If you do not have energy, get it. (by mining or by withdrawing from storage/other creeps. Chosen method depends on the type of creep.)
    2. Check if you have a target.
    2b. If you do not have a target, get one from the list of possible targets.
    3. Check if you are in range of your target.
    3b. If you are not in range of your target, move to your target.
    4. Perform the action related to your target (build building, upgrade controller, refill energy, etc)
    4b. If the target is invalid for some reason, delete the target and start from 2.
    '''

    CollectEnergyIfneeded(creep)
    if creep.memory.filling:
        # print('Creep ' + str(creep) + ' is filling')
        if creep.memory.WithdrawTarget == None:
            creep.memory.WithdrawTarget = creep.room.memory.controllerContainer
            collectFromSourceContainer(creep)
        else:
            collectFromSourceContainer(creep)
    elif len(creep.memory.target)>0:
        target = Game.getObjectById(creep.memory.target)

        # If construction was already finished, it refers to a NONEXISTING construction site.
        if target is None:
            del creep.memory.target

        # Ductape fix:
        if creep.memory.AwaitingRefill:
            creep.memory.AwaitingRefill = False
        # print('Creep ' + str(creep) + ' is close to the target: ' + str(creep.pos.inRangeTo(target, 3)))
        if creep.pos.inRangeTo(target, 3):
            if creep.memory.job == 'Build':
                # print('Creep ' + str(creep) + ' attempts to build')
                Build(creep, target)
            elif creep.memory.job == 'Repair':
                # print('Creep ' + str(creep) + ' attempts to Repair')
                Repair(creep, target)
            else:
                # print('Creep ' + str(creep) + ' attempts to upgrade')
                Upgrade(creep, target)
        else:
            CreepMove(creep, target)

    else:
        setTarget_Builder(creep)

################################################################## Start of Hauler #########################################################################

def CollectFromMiner (creep):
    '''
    This creep has an assigned source for its lifetime. This function is: go to the assigned source and wait for a miner to hand you energy.
    '''
    # If we have a saved source, use it
    if len(creep.memory.PickupPoint) > 0:
        PickupPoint = Game.getObjectById(creep.memory.PickupPoint)
    else:
        # get assigned a source by the room manager:
        creep.memory.PickupPoint = Strategy.assignSameRoomPickupPoint(creep.room)
        creep.memory.WaitForMiner = False

    # If we are near the pickup point, wait until a miner is full
    if creep.memory.WaitForMiner == True:
        # A fix for rare cases where this dude will just stare at the miner which just spawned after he got to the point:
        if len(creep.memory.Miners) <1:
            creep.memory.WaitForMiner = False

        for miner in creep.memory.Miners:
            # If they are full, set them as your target
            if Game.creeps[miner] == None or len(creep.memory.Miners) <1:
                # If the miner has died reset, rebuild the pool.
                creep.memory.WaitForMiner = False

            elif _.sum(Game.creeps[miner].carry) >= Game.creeps[miner].carryCapacity:
                # print(creep.name + ' Creep has found a potential target: ' + Game.creeps[miner].name)
                creep.memory.target = Game.creeps[miner].id
                creep.memory.WaitForMiner = False
                # Tell the miner to give you its energy.
                Game.creeps[miner].memory.target = creep.id
                break
    # If we are not even near the pickup point, move to the pickup point.
    else:
        if PickupPoint == None:
            pass
        elif creep.pos.inRangeTo(PickupPoint, 2):
            creep.memory.WaitForMiner = True
            creep.memory.Miners = []
            # Find the miners who are currently mining from this source:
            SameSourceMiners = creep.room.find(FIND_CREEPS).filter(lambda c: c.memory.source == PickupPoint.id and len(c.memory.source)>0)
            for miner in SameSourceMiners:
                creep.memory.Miners.append(miner.name)
        else:
            creep.moveTo(PickupPoint)
            creep.memory.WaitForMiner = False

    # print('This actually happenedxz-' + str(creep.memory.target))
    # If you have a target to pick up from
    if len(creep.memory.target) > 0:
        target = Game.getObjectById(creep.memory.target)
        # print ('moving to ' + str(target))
        if target == None:
            del creep.memory.target
        elif creep.pos.isNearTo(target) == False:
            CreepMove(creep, target)
        # If another creep has already emptied this creeps inventory.
        elif _.sum(target.carry) < target.carryCapacity:
            creep.memory.WaitForMiner = False
            del creep.memory.target
        else:
            target.memory.target = creep.id
            creep.memory.WaitForMiner = True




def TransferEnergyToWaitingTarget (creep):
    target = Game.getObjectById(creep.memory.target)
    if target.memory.AwaitingRefill == False:
        del creep.memory.target
    # elif creep.room.memory.building == True and target.memory.designation != 'Builder':
    #     del creep.memory.target
    # elif creep.room.memory.building == False and target.memory.designation == 'Builder':
    #     del creep.memory.target
    elif not creep.pos.isNearTo(target):
        CreepMove(creep, target)
    else:
        result = creep.transfer(target, RESOURCE_ENERGY, _.sum(creep.carry))
        # print (creep.name + 'attempted to transfer energy - r: ' +str(result))
        if result == 0:
            if target.designation == 'Builder':
                if len(creep.room.find(FIND_CREEPS).filter(lambda c: c.memory.AwaitingRefill == True)) == 0:
                    creep.room.memory.builderAwaitingRefill = False
            del creep.memory.target
            target.memory.AwaitingRefill == False
        elif result == -8:
            result = creep.transfer(target, RESOURCE_ENERGY, (target.carryCapacity - _.sum(target.carry)))
            if target.designation == 'Builder':
                if len(creep.room.find(FIND_CREEPS).filter(lambda c: c.memory.AwaitingRefill == True)) == 0:
                    creep.room.memory.builderAwaitingRefill = False
            del creep.memory.target
            target.memory.AwaitingRefill == False

def DistributeEnergy (creep):
    '''
    There are two potential points where energy can be distributed: spawn and controller.
    The creep has to go to the dropoff point and hand the energy to the corresponding creep type.
    '''
    if creep.room.memory.building:
        if len(creep.memory.spawn) > 0:
            dropoffPoint = Game.getObjectById(creep.memory.spawn)
        else:
            for name in Object.keys(Game.spawns):
                spawn = Game.spawns[name]
                if spawn.room.name == creep.room.name:
                    creep.memory.spawn = spawn.id
                    dropoffPoint = spawn

        appropriateDistance = 2
    else:
        dropoffPoint = creep.room.controller
        appropriateDistance = 4

    if len(creep.memory.target) > 0:
        # print (str(creep) + 'attempting to transfer energy to awaiting target')
        if Game.getObjectById(creep.memory.target) == None:
            del creep.memory.target
        else:
            TransferEnergyToWaitingTarget(creep)
    elif not creep.pos.inRangeTo(dropoffPoint, appropriateDistance):
        creep.moveTo(dropoffPoint)
        # print (str(creep) + 'moving to dropoff point', + str(dropoffPoint) + str(creep.pos.inRangeTo(dropoffPoint, appropriateDistance)) + str(appropriateDistance))

    elif creep.room.memory.builderAwaitingRefill == True:
        # print (str(creep) + 'Setting transfer target')
        target = creep.room.find(FIND_CREEPS).filter(lambda c: c.memory.AwaitingRefill == True)
        if len(target) <1:
            creep.room.memory.builderAwaitingRefill = False
        else:
            target = creep.pos.findClosestByPath(target)
            # print(target)
            creep.memory.target = target.id
            TransferEnergyToWaitingTarget(creep)


    else:
        # Reset:
        # print (str(creep) + 'Could not find transfer targets')
        del creep.memory.job

def GiveEnergyToReichsprotector (creep):
    """
    Me, 15-08-2023: This has been pass but the code works!? no fucking clue. Leave it be just in case.
    """
    pass

def SetHaulerJob (creep):
    if FindRefillTarget(creep):
        creep.memory.job = 'Replenish'
    elif False:
        creep.memory.job = 'Refill'
    else:
        creep.memory.job = 'Transfer'

def Run_Hauler(creep):
    '''
    The hauler does the following:
    1. Check if it is empty
    1b. If empty, get energy by walking to a miner and wait for it to give the hauler energy (until hauler inventory is full)
    2. Move to spawn.
    3. Transfer energy to someone or a container, depending on a CURRENTLY NONEXISTING condition.
    '''
    CollectEnergyIfneeded(creep)
    if creep.memory.filling:
        # print('Creep ' + str(creep) + ' is filling')
        CollectFromMiner (creep)

    # If it has a job, act on it, else get a job.
    elif len (creep.memory.job) >0:
        if creep.memory.job == 'Replenish':
            if len(creep.memory.target)>0:
                target = Game.getObjectById(creep.memory.target)
                if creep.pos.isNearTo(target):
                    Replenish(creep, target)
                else:
                    CreepMove(creep, target)
            # Find a new refill target:
            elif FindRefillTarget(creep):
                pass
            # Reset:
            else:
                del creep.memory.job
        elif creep.memory.job == 'Transfer':
            DistributeEnergy (creep)
    else:
        SetHaulerJob(creep)
        # Ductape fix of something broken:
        creep.memory.WaitForMiner = False


################################################################## End of Hauler ###########################################################################
############################################################### start of hauler V2 #########################################################################
def WithdrawFromContainer(creep, target):
    amountToBeWithdrawn = creep.carryCapacity - _.sum(creep.carry)
    energyAvailable = target.store.getUsedCapacity(RESOURCE_ENERGY)
    # Do not try to overdraw, either get the amount you can carry or get the amount of energy in the sthing. Whichever is the least.
    amountToBeWithdrawn = min(amountToBeWithdrawn, energyAvailable)
    if amountToBeWithdrawn == 0:
        del creep.memory.WithdrawTarget
    else:
        result = creep.withdraw(target, RESOURCE_ENERGY, amountToBeWithdrawn)
        if  result == 0:
            del creep.memory.WithdrawTarget
        elif result <-5:
            print (creep.name + ' Failed to withdrawn energy from ' + str(target.id) + str(result) + ' , contained this much energy: ' + str(energyAvailable))
            del creep.memory.WithdrawTarget


def collectFromSourceContainer(creep):
    """
    First it has to idenitfy which container will be the target
    once the target is set, move to the target.
    once you get there, withdraw and delete target.
    done
    """
    if creep.memory.WithdrawTarget == None:
        for i in creep.room.memory.sourceContainers:
            container = Game.getObjectById(i)
            if container == None:
                pass
            elif container.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.carryCapacity:
                creep.memory.WithdrawTarget = container.id
                break

    target = Game.getObjectById(creep.memory.WithdrawTarget)
    if target == None:
        del creep.memory.WithdrawTarget
    else:
        if not creep.pos.isNearTo(target):
            # if not next to the container
            CreepMove(creep, target)
            if creep.pos.isNearTo(target):
                WithdrawFromContainer(creep, target)
        else:
            WithdrawFromContainer(creep, target)

def PickDropoffContainer (creep):
    """
    The first thing it has to to is figure out which container to put the energy into:
    """

    # If no end destination is defined:
    if creep.memory.target == None:
        # Check if spawn has an empty container:
        container = Game.getObjectById(creep.room.memory.spawnContainer)
        if container.store.getFreeCapacity(RESOURCE_ENERGY) <=0:
            # Check if controller has an empty container:
            container = Game.getObjectById(creep.room.memory.controllerContainer)
            if container.store.getFreeCapacity(RESOURCE_ENERGY) <=0:
                # Do nothing, wait for a container to become empty.
                pass
            else:
                # Set target == to container at controller
                creep.memory.target = container.id
                if not creep.pos.isNearTo(container):
                    # if not next to the container
                    CreepMove(creep, container)
                else:
                    Replenish(creep, target)

        else:
            # Set target == to container at spawn
            creep.memory.target = container.id
            if not creep.pos.isNearTo(container):
                # if not next to the container
                CreepMove(creep, container)
            else:
                Replenish(creep, target)

def DepositIntoContainer (creep, target):
    if creep.pos.isNearTo(target):
        Replenish(creep, target)
    else:
        CreepMove(creep, target)
        if creep.pos.isNearTo(target):
            Replenish(creep, target)


# amountToBeWithdrawn = creep.carryCapacity - _.sum(creep.carry)
# energyAvailable = target.store.getUsedCapacity
# # Do not try to overdraw, either get the amount you can carry or get the amount of energy in the sthing. Whichever is the least.
# amountToBeWithdrawn = min(amountToBeWithdrawn, energyAvailable)
# result = creep.withdraw(target, RESOURCE_ENERGY, amountToBeWithdrawn)
# if result == 0:
#     del creep.memory.WithdrawTarget
# elif result <-5:
#     print (creep.name + ' Failed to withdrawn energy from ' + str(target.id))
#     del creep.memory.WithdrawTarget



def SetHaulerJobMidgame(creep):
        if FindRefillTarget(creep):
            creep.memory.job = 'Replenish'
        else:
            creep.memory.job = 'ContainerRefill'

def Run_Hauler_midgame(creep):
    '''
    The hauler does the following:
    1. Check if it is empty
    1b. if empty, collect energy from one of the containers associated to a source
    2.
    '''
    CollectEnergyIfneeded(creep)
    if creep.memory.filling:
        # print('Creep ' + str(creep) + ' is filling')
        collectFromSourceContainer (creep)
    # If it has a job, act on it, else get a job.
    elif len (creep.memory.job) >0:
        # Refill spawn and extensions:
        if creep.memory.job == 'Replenish':
            if len(creep.memory.target)>0:
                target = Game.getObjectById(creep.memory.target)
                if creep.pos.isNearTo(target):
                    Replenish(creep, target)
                else:
                    CreepMove(creep, target)
            # Find a new refill target:
            elif FindRefillTarget(creep):
                # Returns true if it found an extension or spawn to refill, if it does not find one it will go to the else (and resets the job.)
                pass
            # Reset:
            else:
                del creep.memory.job

        elif creep.memory.job == 'ContainerRefill':
            # Refill containers:
            if len(creep.memory.target)>0:
                target = Game.getObjectById(creep.memory.target)
                DepositIntoContainer(creep, target)
            # Find a new refill target:
            elif PickDropoffContainer(creep):
                pass
            # Reset:
            else:
                del creep.memory.job
        # Debugging line: if it has a job, but its neither of the accepted jobs, delete the job:
        else:
            del creep.memory.job
    else:
        SetHaulerJobMidgame(creep)


############################################################### end of hauler V2 ##########################################################################


################################################################# Start of Miner ###########################################################################

def transferEnergyToHauler (creep, target):
    """"
    The aim of this code is for the miner to do the following:
    0. The hauler has told the miner (see run_hauler) it is ready to recieve the energy from the miner.
    1. The hauler tries to transfer the enrgy to the target (hauler)
    2. The miner sets the memory of the hauler to the "I have recieved energy from the miner"
    """
    if target == None:
        print (str(creep.name) + ' attempted to transfer energy to a nonexisting creep.' )
        del creep.memory.target
    else:
        # print(str(creep.name) + creep.pos.isNearTo(target) + str(target))
        if creep.pos.isNearTo(target):
            result = creep.transfer(target, RESOURCE_ENERGY, _.sum(creep.carry))
            # print(result)
            if result == -8:
                result = creep.transfer(target, RESOURCE_ENERGY, (target.carryCapacity - _.sum(target.carry)))
                creep.memory.filling = True
                Mine(creep)
                if result != 0:
                    print (str(creep.name) + ' attempted to transfer energy to ' +str (target) + str(result) + str(target.carryCapacity - _.sum(target.carry)))
                else:
                    del target.memory.target
                    del creep.memory.target
                    target.memory.WaitForMiner = False
                    creep.memory.filling = True
                    Mine(creep)
            elif result != 0:
                print (str(creep.name) + ' attempted to transfer energy to ' +str (target) + str(result) + str(_.sum(creep.carry)))
            else:
                del target.memory.target
                del creep.memory.target
                target.memory.WaitForMiner = False
                Mine(creep)

def MinerIdentifyContainer(creep):
    """
    Is there a container within 1 tile of the miner? Yes. Remember it as your target until you die.
    """
    if creep.pos.isNearTo(Game.getObjectById(creep.memory.source)):
        containers = creep.room.find(FIND_STRUCTURES).filter(lambda s: s.structureType == STRUCTURE_CONTAINER)
        creep.memory.target = creep.pos.findClosestByPath(containers).id
        if creep.memory.target == None:
            # should never happen. but if it does, fuck it.
            print('No containers could be found for this creep: ' + str(creep.name))
    else:
        CreepMove(creep, Game.getObjectById(creep.memory.source))

def MinerTransferToContainer (creep):
    """
    Do you have a container in memory? yes. Dump your energy in it.
    No? Get one in memory.
    """
    if creep.memory.target == None:
        MinerIdentifyContainer(creep)
    else:
        target = Game.getObjectById(creep.memory.target)
        Replenish(creep, target)

def run_miner_midgame(creep):
    '''
    The Miner does the following:
    1. Check if it is empty
    1b. If empty, get energy by walking to a to a source and mine it.
    2. Once full, transer to a nearby source.
    They do this until they die. Poor sods. I feel like this life of slavery needs some form of reprieve.
    I hope God grants them Mercy.
    For I will not.
    '''
    # print('We are actually running a midgame creep')
    if _.sum(creep.carry) != creep.carryCapacity:
        Mine(creep)
    if _.sum(creep.carry) > 0:
        MinerTransferToContainer(creep)

def Run_miner (creep):
    '''
    The Miner does the following:
    1. Check if it is empty
    1b. If empty, get energy by walking to a to a source and mine it.
    2. Once full, wait for a Hauler to signal 'ready for pickup'
    3. Transfer energy to the hauler.
    '''

    # Alt version of CollectEnergyIfneeded(creep), to deal with the JackOfAllTrades reset
    if _.sum(creep.carry) >= creep.carryCapacity:
        creep.memory.filling = False

    # If we're empty, start filling again and remove the saved target
    else:
        creep.memory.filling = True

    if creep.memory.filling:
        # print('Creep ' + str(creep) + ' is filling')
        Mine(creep)
    elif len(creep.memory.target) > 0:
        target = Game.getObjectById(creep.memory.target)
        transferEnergyToHauler (creep, target)

    else :
        # Wait for the miner to get there
        pass

#####################################################################################

def Run_Reichsprotektor(creep):
    '''
    This is the basic creep running framework, it works in this order:
    1. check if you have energy.
    1b. If you do not have energy, get it. (by mining or by withdrawing from storage/other creeps. Chosen method depends on the type of creep.)
    2. Check if you have a target.
    2b. If you do not have a target, get one from the list of possible targets.
    3. Check if you are in range of your target.
    3b. If you are not in range of your target, move to your target.
    4. Perform the action related to your target (build building, upgrade controller, refill energy, etc)
    4b. If the target is invalid for some reason, delete the target and start from 2.
    '''
    if _.sum(creep.carry) >= 1:
        creep.memory.filling = False
    else:
        creep.memory.filling = True

    if creep.memory.filling:
        # print('Creep ' + str(creep) + ' is filling')
        collectFromLogisticsBoi(creep)
    elif len(creep.memory.target)>0:
        target = Game.getObjectById(creep.memory.target)

        # Ductape fix:
        if creep.memory.AwaitingRefill:
            creep.memory.AwaitingRefill = False
        # print('Creep ' + str(creep) + ' is close to the target: ' + str(creep.pos.inRangeTo(target, 3)))
        if creep.pos.inRangeTo(target, 3):
                Upgrade(creep, target)
        else:
            CreepMove(creep, target)

    else:
        creep.memory.target = creep.room.controller.id

################################################################### Midgame version ################################################################
def Run_Reichsprotektor_midgame(creep):
    '''
    This is the basic creep running framework, it works in this order:
    1. check if you have energy.
    1b. If you do not have energy, get it. (by withdrawing from storage)
    2. Check if you have a target.
    2b. If you do not have a target, get one from the list of possible targets.
    3. Check if you are in range of your target.
    3b. If you are not in range of your target, move to your target.
    4. Perform the action related to your target (build building, upgrade controller, refill energy, etc)
    4b. If the target is invalid for some reason, delete the target and start from 2.
    '''
    if _.sum(creep.carry) >= 1:
        creep.memory.filling = False
    else:
        creep.memory.filling = True

    if creep.memory.filling:
        # print('Creep ' + str(creep) + ' is filling')
        if creep.memory.WithdrawTarget == None:
            creep.memory.WithdrawTarget = creep.room.memory.controllerContainer
            collectFromSourceContainer(creep)
        else:
            collectFromSourceContainer(creep)
    elif len(creep.memory.target)>0:
        target = Game.getObjectById(creep.memory.target)

        # Ductape fix:
        if creep.memory.AwaitingRefill:
            creep.memory.AwaitingRefill = False
        # print('Creep ' + str(creep) + ' is close to the target: ' + str(creep.pos.inRangeTo(target, 3)))
        if creep.pos.inRangeTo(target, 3):
                Upgrade(creep, target)
        else:
            CreepMove(creep, target)

    else:
        creep.memory.target = creep.room.controller.id
