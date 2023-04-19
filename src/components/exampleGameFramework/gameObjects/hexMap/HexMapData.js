import HexMapSelectionsClass from "./HexMapDataSelections";

export default class HexMapDataClass {

    constructor(settings, canvas) {

        this.state = {
            selectTile: 'selectTile',
            selectMovement: 'selectMovement',
            placeUnit: 'placeUnit',
            chooseRotation: 'chooseRotation',
            selectAction: 'selectAction',
            animation: 'animation'
        }
        this.state.current = this.state.selectTile

        this.renderBackground = true

        this.size = canvas.width / settings.TILE_SIZE;
        this.squish = settings.HEXMAP_SQUISH;
        this.tileHeight = settings.TILE_HEIGHT;
        this.shadowRotation = settings.SHADOW_ROTATION;

        this.VecQ = { x: Math.sqrt(3) * this.size, y: 0 }
        this.VecR = { x: Math.sqrt(3) / 2 * this.size, y: 3 / 2 * this.size }
        this.flatTopVecQ = { x: 3 / 2 * this.size, y: Math.sqrt(3) / 2 * this.size }
        this.flatTopVecR = { x: 0, y: Math.sqrt(3) * this.size }
        this.sideLength = Math.PI / 3;
        this.selections = new HexMapSelectionsClass()

        //will be player data
        this.resources = 0
    }

    resetState = () => {
        this.resetSelected()
        this.state.current = this.state.selectTile
    }

    setState = (state) => {
        if(!this.state[state]) throw new Error(`STATE NAME ERROR - HexMapDataClass does not have a state called: ${state}`)
        this.state.current = this.state[state]
    }


    getSelectionPosition = (selection) => {
        return this.selections[selection]
    }
    
    getSelection = (q, r) => {
        if(this.selections.hover && this.selections.hover.q == q && this.selections.hover.r == r) return 'hover'
        if(this.selections.tile && this.selections.tile.q == q && this.selections.tile.r == r) return 'tile'
        if(this.selections.unit && this.selections.unit.q == q && this.selections.unit.r == r) return 'unit'
        if(this.selections.target && this.selections.target.q == q && this.selections.target.r == r) return 'target'
        if(this.selections.path.some(val => val.q == q && val.r == r)) return 'path'
        if(this.selections.pathing.movement.some(val => val.q == q && val.r == r)) return 'movement'
        if(this.selections.pathing.action.some(val => val.q == q && val.r == r)) return 'action'
        if(this.selections.pathing.attack.some(val => val.q == q && val.r == r)) return 'attack'
        return null
    }

    setSelection = (q, r, selection) => {
        this.selections[selection] = { q: q, r: r }
    }

    setPathingSelections = (pathing) => {
        this.selections.pathing = pathing
    }

    resetSelected = () => {
        this.selections.hover = null
        this.selections.tile = null
        this.selections.unit = null
        this.selections.target = null
        this.selections.path = []
        this.selections.pathing = {
            movement: [],
            action: [],
            attack: []
        }
    }

    resetHover = () => {
        this.selections.hover = null
    }


}