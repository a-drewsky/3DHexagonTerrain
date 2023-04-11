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


}