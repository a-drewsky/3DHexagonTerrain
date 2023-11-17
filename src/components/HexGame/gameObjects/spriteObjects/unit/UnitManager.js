import UnitRendererClass from "./UnitRenderer"
import HexMapControllerUtilsClass from "../../hexMap/controllers/HexMapControllerUtils"

export default class UnitManagerClass {

    constructor(hexMapData, images) {
        this.mapData = hexMapData.mapData
        this.selectionData = hexMapData.selectionData
        this.projectileData = hexMapData.projectileData
        this.data = hexMapData.unitData

        this.structureData = hexMapData.structureData

        this.renderer = new UnitRendererClass(hexMapData, images)
        this.utils = new HexMapControllerUtilsClass(hexMapData)
    }

    update = () => {
        for (let unit of this.data.unitList) {
            unit.setFrame()

            if (unit.endOfState()) this.endUnitState(unit)
        }
    }

    endUnitState = (unit) => {
        switch (unit.curState()) {
            case 'walk':
            case 'jump':
                this.endMovement(unit)
                return
            case 'mine':
                this.endMining(unit)
                return
            case 'attack':
                this.endAttack(unit)
                return
            case 'hit':
                this.endHit(unit)
                return
            case 'death':
                this.endDeath(unit)
                return
            case 'capture':
                this.endCapture(unit)
                return
            default:
                return
        }
    }

    endHit = (unit) => {
        if (unit.stats.health <= 0) {
            unit.setAnimation('death')
            this.mapData.setState('animation')
            return
        }
        unit.setIdle()
        this.mapData.resetState()
    }

    endDeath = (unit) => {
        this.data.deleteUnit(unit.position)
        this.mapData.resetState()
    }

    endAttack = (unit) => {
        switch (unit.id) {
            case 'mountain_ranger':
                this.endProjectileAttack(unit)
                return
            default:
                this.endAdjacentAttack(unit)
                return
        }
    }

    endProjectileAttack = (unit) => {
        this.projectileData.newProjectile('arrow_projectile', unit.position, this.data.unitTarget)
        this.endAction(unit)
        this.mapData.setState('animation')
    }

    endAdjacentAttack = (unit) => {
        let targetObject = this.utils.getTargetObject(this.data.unitTarget)
        targetObject.stats.health -= 25

        this.endAction(unit)

        if (targetObject.type === 'unit') {
            targetObject.setAnimation('hit')
            this.mapData.setState('animation')
        } else {
            targetObject.updateState()
            this.mapData.resetState()
        }    
    }

    endMovement = (unit) => {
        unit.updatePath()
        if (unit.actionComplete) {
            unit.setIdle()
            this.data.clearTarget()
            this.selectionData.setInfoSelection('unit', unit.position)
            this.mapData.setState('chooseRotation')
            this.utils.findActionSet()
            this.utils.findAttackSet()
        } else {
            this.mapData.setState('animation')
        }
    }

    endMining = (unit) => {
        let mine = this.structureData.getStructure(this.data.unitTarget)
        let resourcesToMine = Math.min(mine.stats.resources, unit.stats.mining)
        mine.stats.resources -= resourcesToMine
        this.mapData.resources[mine.resource] += resourcesToMine
        mine.updateState()

        this.endAction(unit)
        this.mapData.resetState()
    }

    endCapture = (unit) => {
        let flag = this.structureData.getStructure(this.data.unitTarget)
        flag.setCaptured()

        this.endAction(unit)
        this.mapData.resetState()
    }

    endAction = (unit) => {
        unit.setIdle()
        this.data.unselectUnit()
    }

    render = () => {

        for (let unit of this.data.unitList) {
            if (unit.render) this.renderer.render(unit)
            unit.render = false
        }

        if (this.data.placementUnit) {
            if (this.data.placementUnit.render) this.renderer.render(this.data.placementUnit)
            this.data.placementUnit.render = false
        }
        
    }

}