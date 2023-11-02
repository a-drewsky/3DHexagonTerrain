export default class SelectionDataClass {

    constructor(mapData) {

        this.mapData = mapData

        this.infoSelections = {
            tile: null,
            hover: null,
            unit: null
        }

        this.pathingSelections = {
            movement: [],
            action: [],
            attack: [],
            path: [],
            placement: []
        }

        this.targetSelection = {
            typeList: {
                action: 'action',
                attack: 'attack',
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
                    chooseRotation: 'hover_select',
                    placeUnit: 'hover_place'
                },
                unit: {
                    chooseRotation: 'rotate',
                    selectMovement: 'unit',
                    selectAction: 'unit'
                }
            },
            pathing: {
                movement: 'pathing_movement',
                action: 'pathing_action',
                attack: 'pathing_attack',
                path: 'path',
                placement: 'placement'
            },
            target: {
                attack: 'target_attack',
                action: 'target_action',
                move: 'target_move'
            }
        }

    }

    getSelectionNames = (q, r) => {
        let testSelection = (selectionList, selection) => {
            if (!this[selectionList][selection]) return false
            if (this[selectionList][selection].q != q) return false
            if (this[selectionList][selection].r != r) return false
            return true
        }

        let testSelectionArr = (selectionList, selection) => {
            if (this[selectionList][selection].some(val => val.q == q && val.r == r)) return true
            return false
        }

        let testTargetSelection = () => {
            if(!this.targetSelection.position) return false
            if(this.targetSelection.position.q != q) return false
            if(this.targetSelection.position.r != r) return false
            return true
        }

        let selections = []
        if (testSelection('infoSelections', 'tile')) selections.push(this.selectionMapping.info.tile)
        if (testSelection('infoSelections', 'hover')) selections.push(this.selectionMapping.info.hover[this.mapData.state.current])
        if (testSelection('infoSelections', 'unit')) selections.push(this.selectionMapping.info.unit[this.mapData.state.current])

        if (testSelectionArr('pathingSelections', 'movement')) selections.push(this.selectionMapping.pathing.movement)
        if (testSelectionArr('pathingSelections', 'action')) selections.push(this.selectionMapping.pathing.action)
        if (testSelectionArr('pathingSelections', 'attack')) selections.push(this.selectionMapping.pathing.attack)
        if (testSelectionArr('pathingSelections', 'path')) selections.push(this.selectionMapping.pathing.path)
        if (testSelectionArr('pathingSelections', 'placement')) selections.push(this.selectionMapping.pathing.placement)

        if (testTargetSelection()) selections.push(this.selectionMapping.target[this.targetSelection.type])

        return selections
    }


    getInfoSelection = (selection) => {
        return this.infoSelections[selection]
    }

    getPathingSelection = (selection) => {
        return this.pathingSelections[selection]
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

    setPath = (value) => {
        this.pathingSelections.path = value
    }

    setTargetSelection = (position, type) => {
        this.targetSelection.position = position
        this.targetSelection.type = this.targetSelection.typeList[type]
    }

    clearPath = () => {
        this.pathingSelections.path = []
    }

    clearPathing = () => {
        this.pathingSelections = {
            movement: [],
            action: [],
            attack: [],
            path: [],
            placement: []
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
        this.infoSelections = {
            hover: null,
            tile: null,
            unit: null
        }

        this.pathingSelections = {
            movement: [],
            action: [],
            attack: [],
            path: [],
            placement: []
        }

        this.clearTarget()
    }

}