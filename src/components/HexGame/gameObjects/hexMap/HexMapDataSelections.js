export default class HexMapDataSelectionsClass {

    constructor() {
        this.selections = {
            hover: null,
            tile: null,
            unit: null,
            target: null,
            path: [],
            pathing: {
                movement: [],
                action: [],
                attack: []
            },
            placement: []
        }

        this.initSelections = {...this.selections}

        this.stateSelections = {
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
        }
    }


    //SELECTIONS
    getSelectionPosition = (selection) => {
        return this.selections[selection]
    }

    getSelections = (q, r) => {
        let selections = []
        if (this.selections.hover && this.selections.hover.q == q && this.selections.hover.r == r) selections.push('hover')
        if (this.selections.tile && this.selections.tile.q == q && this.selections.tile.r == r) selections.push('tile')
        if (this.selections.unit && this.selections.unit.q == q && this.selections.unit.r == r) selections.push('unit')
        if (this.selections.target && this.selections.target.q == q && this.selections.target.r == r) selections.push('target')
        if (this.selections.path.some(val => val.q == q && val.r == r)) selections.push('path')
        if (this.selections.pathing.movement.some(val => val.q == q && val.r == r)) selections.push('movement')
        if (this.selections.pathing.action.some(val => val.q == q && val.r == r)) selections.push('action')
        if (this.selections.pathing.attack.some(val => val.q == q && val.r == r)) selections.push('attack')
        if (this.selections.placement.some(val => val.q == q && val.r == r)) selections.push('placement')
        return selections
    }

    setSelection = (q, r, selection) => {
        this.selections[selection] = { q: q, r: r }
    }

    setPathingSelections = (pathingObj) => {
        this.selections.pathing = pathingObj
    }

    setPlacementSelection = (placementArr) => {
        this.selections.placement = placementArr
    }

    resetSelected = () => {
        this.selections = {
            hover: null,
            tile: null,
            unit: null,
            target: null,
            path: [],
            pathing: {
                movement: [],
                action: [],
                attack: []
            },
            placement: []
        }
    }

    resetHover = () => {
        this.selections.hover = null
    }

}