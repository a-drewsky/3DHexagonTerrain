import UnitRendererClass from "../renderers/UnitRenderer"
import HexMapControllerUtilsClass from "../controllers/utils/HexMapControllerUtils"

export default class UnitManagerClass {

    constructor(gameData, images) {
        this.mapData = gameData.mapData
        this.selectionData = gameData.selectionData
        this.projectileData = gameData.projectileData
        this.data = gameData.unitData

        this.structureData = gameData.structureData

        this.renderer = new UnitRendererClass(gameData, images)
        this.utils = new HexMapControllerUtilsClass(gameData)
    }

    update = () => {
        for (let unit of this.data.unitList) {
            unit.setFrame()
            if (unit.destination !== null) unit.render = true

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
            case 'post_attack':
                this.endPostAttack(unit)
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
        if (unit.health <= 0) {
            unit.setAnimation('death')
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
        unit.setAnimation('post_attack')
    }

    endAdjacentAttack = (unit) => {
        let targetObject = this.utils.getTargetObject(this.data.unitTarget)
        targetObject.health -= 25

        unit.setAnimation('post_attack')

        if (targetObject.spriteType === 'unit') {
            targetObject.setAnimation('hit')
        } else {
            targetObject.updateState()
        }
    }

    endPostAttack = (unit) => {
        this.endAction(unit)
        this.mapData.resetState()
    }

    endMovement = (unit) => {
        unit.updatePath()
        if (unit.actionComplete) {
            unit.setIdle()
            this.utils.setChooseRotation(unit)
        } else {
        }
    }

    endMining = (unit) => {
        let mine = this.structureData.getStructure(this.data.unitTarget)
        let resourcesToMine = Math.min(mine.resources, unit.stats.mining)
        mine.resources -= resourcesToMine
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