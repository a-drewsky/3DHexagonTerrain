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

    //get an entry in the tileMap (returns a hex tile object)
    getSelectionArr = () => {
        let hoverSelection = () => {
            if (this.state.current == this.state.selectTile) return 'hover_select'
            if (this.state.current == this.state.chooseRotation) return 'hover_select'
            else if (this.state.current == this.state.placeUnit) return 'hover_place'
            else return null
        }

        let unitSelection = () => {
            if (this.state.current == this.state.chooseRotation) return 'rotate'
            if (this.state.current == this.state.selectMovement) return 'unit'
            if (this.state.current == this.state.selectAction) return 'unit'
            else return null
        }

        let selectionList = this.selections

        let filteredSelectionList = []

        if (selectionList.hover !== null && hoverSelection() !== null) filteredSelectionList.push({ position: selectionList.hover, selection: hoverSelection() })
        if (selectionList.unit !== null && unitSelection() !== null) filteredSelectionList.push({ position: selectionList.unit, selection: unitSelection() })
        if (selectionList.tile !== null) filteredSelectionList.push({ position: selectionList.tile, selection: 'tile' })
        if (selectionList.target !== null) filteredSelectionList.push({ position: selectionList.target, selection: 'target' })

        for (let item of selectionList.path) {
            filteredSelectionList.push({ position: item, selection: 'path' })
        }

        for (let selList in selectionList.pathing) {
            for (let item of selectionList.pathing[selList]) {
                filteredSelectionList.push({ position: item, selection: selList })
            }
        }
        return filteredSelectionList
    }


}