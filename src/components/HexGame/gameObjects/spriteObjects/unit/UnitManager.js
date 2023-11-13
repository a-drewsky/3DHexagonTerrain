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

            if (!unit.endOfState()) continue

            switch (unit.curState()) {
                case 'walk':
                case 'jump':
                    this.endMovement(unit)
                    continue
                case 'mine':
                    this.endMining(unit)
                    continue
                case 'attack':
                    this.endAttack(unit)
                    continue
                case 'hit':
                    this.endHit(unit)
                    continue
                case 'death':
                    this.endDeath(unit)
                    continue
                default:
                    continue
            }
        }
    }

    endHit = (unit) => {
        unit.setIdle()
        this.data.clearTarget()
        if (unit.curState() !== 'death') {
            this.mapData.resetState()
            this.selectionData.clearAllSelections()
        }
    }

    endDeath = (unit) => {
        this.data.deleteUnit(unit.position)
        this.mapData.resetState()
        this.selectionData.clearAllSelections()
    }

    endAttack = (unit) => {
        switch (unit.id) {
            case 'mountain_ranger':
                this.endProjectileAttack(unit)
                break
            default:
                this.endAdjacentAttack(unit)
                break
        }
        unit.setIdle()
        this.data.unselectUnit()
        this.data.clearTarget()
    }

    endProjectileAttack = (unit) => {
        this.projectileData.newProjectile('arrow_projectile', unit.position, this.data.unitTarget)
    }

    endAdjacentAttack = (unit) => {

        let targetObject = this.utils.getTargetObject(this.data.unitTarget)
        if(!targetObject) return

        targetObject.recieveAttack(25)
        if (targetObject.type !== 'unit') {
            this.mapData.resetState()
            this.selectionData.clearAllSelections()
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
        }
    }

    endMining = (unit) => {
        this.data.unselectUnit()

        let mine = this.structureData.getStructure(this.data.unitTarget)
        let minedResources = mine.mineResources(unit.stats.mining)
        this.mapData.resources[mine.resource] += minedResources
        unit.setIdle()
        this.data.clearTarget()
        this.mapData.resetState()
        this.selectionData.clearAllSelections()
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