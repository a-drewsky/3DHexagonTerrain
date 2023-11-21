import CommonHexMapUtilsClass from "../../../commonUtils/CommonHexMapUtils"

export default class SelectionDataClass {

    constructor(mapData) {

        this.mapData = mapData

        this.infoSelections = {
            tile: null,
            hover: null,
            unit: null
        }

        this.pathingSelections = {
            placement: [],
            placementHover: null,
            action: [],
            actionHover: null,
            attack: [],
            attackHover: null,
            actionMove: [],
            attackMove: [],
            path: [],
            movement: [],
            locked: false
        }

        this.targetSelection = {
            typeList: {
                action: 'action',
                attack: 'attack',
                placement: 'placement',
                move: 'move',
            },
            position: null,
            type: null
        }

        this.selectionMapping = {
            info: {
                tile: 'tile_info',
                hover: {
                    selectTile: 'hover_select',
                    placeUnit: 'hover_place'
                },
                unit: {
                    chooseRotation: 'rotate',
                    selectMovement: 'unit'
                }
            },
            pathing: {
                movement: 'pathing_movement',
                action: 'pathing_action',
                attack: 'pathing_attack',
                actionMove: 'pathing_action_move',
                attackMove: 'pathing_attack_move',
                path: 'path',
                actionHover: 'hover_action',
                attackHover: 'hover_attack',
                placement: 'placement',
                placementHover: 'hover_placement',
            },
            target: {
                attack: 'target_attack',
                action: 'target_action',
                move: 'target_move',
                placement: 'target_placement',
            }
        }

        this.commonUtils = new CommonHexMapUtilsClass()

    }

    getSelectionNames = (tile) => {
        let testSelection = (selectionList, selection) => {
            if (!this[selectionList][selection]) return false
            if (!this.commonUtils.tilesEqual(this[selectionList][selection], tile)) return false
            return true
        }

        let testSelectionArr = (selectionList, selection) => {
            if (this[selectionList][selection].some(val => this.commonUtils.tilesEqual(val, tile))) return true
            return false
        }

        let testTargetSelection = () => {
            if(!this.targetSelection.position) return false
            if(!this.commonUtils.tilesEqual(this.targetSelection.position, tile)) return false
            return true
        }

        let selections = []
        if (testSelection('infoSelections', 'tile')) selections.push(this.selectionMapping.info.tile)
        if (testSelection('infoSelections', 'hover') && this.mapData.curState() !== 'animation') selections.push(this.selectionMapping.info.hover[this.mapData.curState()])
        if (testSelection('infoSelections', 'unit')) selections.push(this.selectionMapping.info.unit[this.mapData.curState()])

        if (testSelectionArr('pathingSelections', 'movement')) selections.push(this.selectionMapping.pathing.movement)
        if (testSelectionArr('pathingSelections', 'action')) selections.push(this.selectionMapping.pathing.action)
        if (testSelectionArr('pathingSelections', 'attack')) selections.push(this.selectionMapping.pathing.attack)
        if (testSelectionArr('pathingSelections', 'actionMove')) selections.push(this.selectionMapping.pathing.actionMove)
        if (testSelectionArr('pathingSelections', 'attackMove')) selections.push(this.selectionMapping.pathing.attackMove)
        if (testSelectionArr('pathingSelections', 'path')) selections.push(this.selectionMapping.pathing.path)
        if (testSelectionArr('pathingSelections', 'placement')) selections.push(this.selectionMapping.pathing.placement)
        if (testSelection('pathingSelections', 'actionHover')) selections.push(this.selectionMapping.pathing.actionHover)
        if (testSelection('pathingSelections', 'attackHover')) selections.push(this.selectionMapping.pathing.attackHover)
        if (testSelection('pathingSelections', 'placementHover')) selections.push(this.selectionMapping.pathing.placementHover)

        if (testTargetSelection()) selections.push(this.selectionMapping.target[this.targetSelection.type])

        return selections
    }


    getInfoSelection = (selection) => {
        return this.infoSelections[selection]
    }

    getPathingSelection = (selection) => {
        return this.pathingSelections[selection]
    }

    getPathLocked = () => {
        return this.pathingSelections.locked
    }

    getPath = () => {
        return this.pathingSelections.path
    }

    getTargetSelection = () => {
        return this.targetSelection.position
    }

    getTargetSelectionType = () => {
        return this.targetSelection.type
    }


    setInfoSelection = (selection, value) => {
        this.infoSelections[selection] = value
    }

    setPathingSelection = (selection, value) => {
        this.pathingSelections[selection] = value
    }

    lockPath = () => {
        this.pathingSelections.locked = true
    }

    unlockPath = () => {
        this.pathingSelections.locked = false
    }

    setPath = (value) => {
        this.pathingSelections.path = value
        this.pathingSelections.actionHover = null
        this.pathingSelections.attackHover = null
    }

    addToPath = (value) => {
        this.pathingSelections.path.push(value)
        this.pathingSelections.actionHover = null
        this.pathingSelections.attackHover = null
    }

    setActionHover = (value) => {
        this.pathingSelections.actionHover = value
    }

    setAttackHover = (value) => {
        this.pathingSelections.attackHover = value
    }

    setPlacementHover = (value) => {
        this.pathingSelections.placementHover = value
    }

    setTargetSelection = (position, type) => {
        this.targetSelection.position = position
        this.targetSelection.type = this.targetSelection.typeList[type]
    }

    clearPath = () => {
        this.pathingSelections.path = []
        this.pathingSelections.actionMove = []
        this.pathingSelections.attackMove = []
        this.pathingSelections.actionHover = null
        this.pathingSelections.attackHover = null
        this.pathingSelections.placementHover = null
        this.pathingSelections.locked = false
    }

    clearPathing = () => {
        this.pathingSelections = {
            placement: [],
            placementHover: null,
            action: [],
            actionHover: null,
            attack: [],
            attackHover: null,
            actionMove: [],
            attackMove: [],
            path: [],
            movement: [],
            locked: false
        }
    }

    clearInfo = () => {
        this.infoSelections = {
            hover: null,
            tile: null,
            unit: null
        }
    }

    clearTarget = () => {
        this.targetSelection.position = null
        this.targetSelection.type = null
    }

    clearHover = () => {
        this.infoSelections.hover = null
    }

    clearAllSelections = () => {

        this.clearInfo()

        this.clearPathing()

        this.clearTarget()
    }

}