import { TILE_SIZE, HEXMAP_SQUISH, TILE_HEIGHT, HEXMAP_ELEVATION_RANGES } from './HexMapConstants'

export default class HexMapDataMapClass {

    constructor(canvas) {

        this.state = {
            selectTile: 'selectTile', //default
            animation: 'animation', //waitForAnimation
            selectMovement: 'selectMovement', //movementSelection
            chooseRotation: 'chooseRotation', //rotationSelection
            placeUnit: 'placeUnit', //spritePlacement
            end: 'end', //game has ended
        }
        this.state.current = this.state.selectTile

        this.canvas = canvas
        this.size = canvas.width / TILE_SIZE
        this.squish = HEXMAP_SQUISH
        this.tileHeight = TILE_HEIGHT
        this.elevationRanges = HEXMAP_ELEVATION_RANGES
        
        this.vecQ = { x: 3 / 2 * this.size, y: Math.sqrt(3) / 2 * this.size }
        this.vecR = { x: 0, y: Math.sqrt(3) * this.size }
        this.sideLength = Math.PI / 3

        //ui commands
        this.renderBackground = true

        //will be player data
        this.resources = {
            gold: 10,
            copper: 10,
            iron: 10,
            ruby: 10,
            amethyst: 10
        }
    }

    curState = () => {
        return this.state.current
    }

    resetState = () => {
        this.state.current = this.state.selectTile
        console.log(this.curState())
    }

    setState = (state) => {
        if (!this.state[state]) throw new Error(`STATE NAME ERROR - HexMapDataClass does not have a state called: ${state}`)
        this.state.current = this.state[state]
        console.log(this.curState())
    }


}