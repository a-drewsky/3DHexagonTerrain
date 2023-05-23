import HexMapSelectionsClass from "./HexMapDataSelections";
import CardBuilderClass from "../cards/CardBuilder";

import { TILE_SIZE, HEXMAP_SQUISH, TILE_HEIGHT, SHADOW_ROTATION, HEXMAP_ELEVATION_RANGES } from './HexMapConstants'

export default class HexMapDataClass {

    constructor(canvas) {

        this.state = {
            selectTile: 'selectTile', //default
            selectAction: 'selectAction', //waitForUiInput
            animation: 'animation', //waitForAnimation
            selectMovement: 'selectMovement', //movementSelection
            chooseRotation: 'chooseRotation', //rotationSelection
            placeUnit: 'placeUnit', //spritePlacement
        }
        this.state.current = this.state.selectTile

        this.size = canvas.width / TILE_SIZE;
        this.squish = HEXMAP_SQUISH;
        this.tileHeight = TILE_HEIGHT;
        this.shadowRotation = SHADOW_ROTATION;
        this.elevationRanges = HEXMAP_ELEVATION_RANGES

        this.VecQ = { x: Math.sqrt(3) * this.size, y: 0 }
        this.VecR = { x: Math.sqrt(3) / 2 * this.size, y: 3 / 2 * this.size }
        this.flatTopVecQ = { x: 3 / 2 * this.size, y: Math.sqrt(3) / 2 * this.size }
        this.flatTopVecR = { x: 0, y: Math.sqrt(3) * this.size }
        this.sideLength = Math.PI / 3;
        this.selections = new HexMapSelectionsClass()
        this.cardBuilder = new CardBuilderClass()

        //ui commands
        this.renderBackground = true

        //will be player data
        this.resources = {
            gold: 0,
            copper: 0,
            iron: 0,
            ruby: 0,
            amethyst: 0
        }
        this.cards = []
        this.selectedCard = null
    }

    curState = () => {
        return this.state.current
    }

    resetState = () => {
        this.resetSelected()
        this.state.current = this.state.selectTile
        console.log(this.curState())
    }

    setState = (state) => {
        if (!this.state[state]) throw new Error(`STATE NAME ERROR - HexMapDataClass does not have a state called: ${state}`)
        this.state.current = this.state[state]
        console.log(this.curState())
    }

    //CARDS
    addCard = () => {
        if(this.cards.length==5) return
        if(this.cards.length>0 && this.cards[this.cards.length-1].flipped == true) return

        this.cards.push(this.cardBuilder.buildCard('villager_unit'))
    }

    flipCard = () => {
        this.cards[this.cards.length-1].flipped = false
    }

    removeCard = () => {
        this.cards.splice(this.selectedCard, 1)
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
        this.selections = new HexMapSelectionsClass()
    }

    resetHover = () => {
        this.selections.hover = null
    }


}