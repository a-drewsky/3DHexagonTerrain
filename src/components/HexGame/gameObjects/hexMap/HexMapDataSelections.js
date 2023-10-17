export default class HexMapDataSelectionsClass {

    constructor() {
        this.selections = {
            hover: null,
            tile: null,
            unit: null,
            target: {
                attack: null,
                action: null,
                move: null
            },
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
    getTargetSelectionPosition = (selection) => {
        return this.selections.target[selection]
    }

    getSelections = (q, r) => {
        let selections = []
        if (this.selections.hover && this.selections.hover.q == q && this.selections.hover.r == r) selections.push('hover')
        if (this.selections.tile && this.selections.tile.q == q && this.selections.tile.r == r) selections.push('tile')
        if (this.selections.unit && this.selections.unit.q == q && this.selections.unit.r == r) selections.push('unit')

        if (this.selections.target.attack && this.selections.target.attack.q == q && this.selections.target.attack.r == r) selections.push('target_attack')
        if (this.selections.target.action && this.selections.target.action.q == q && this.selections.target.action.r == r) selections.push('target_action')
        if (this.selections.target.move && this.selections.target.move.q == q && this.selections.target.move.r == r) selections.push('target_move')

        if (this.selections.path.some(val => val.q == q && val.r == r)) selections.push('path')
        if (this.selections.pathing.movement.some(val => val.q == q && val.r == r)) selections.push('movement')
        if (this.selections.pathing.action.some(val => val.q == q && val.r == r)) selections.push('action')
        if (this.selections.pathing.attack.some(val => val.q == q && val.r == r)) selections.push('attack')
        if (this.selections.placement.some(val => val.q == q && val.r == r)) selections.push('placement')

        return selections
    }

    setTargetSelection = (q, r, selection) => {

        if(this.selections.target[selection] === undefined) throw new Error(`SELECTION ERROR - invalid target selection name: ${selection}`)

        this.selections.target.attack = null
        this.selections.target.action = null
        this.selections.target.move = null

        this.selections.target[selection] = { q: q, r: r }

    }

    resetTarget = () => {
        this.selections.target.attack = null
        this.selections.target.action = null
        this.selections.target.move = null
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
            target: {
                attack: null,
                action: null,
                move: null
            },
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