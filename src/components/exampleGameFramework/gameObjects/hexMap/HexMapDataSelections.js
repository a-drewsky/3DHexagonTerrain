export default class HexMapSelectionsClass {

    constructor() {
        this.hover = null
        this.tile = null
        this.unit = null
        this.target = null
        this.path = []
        this.pathing = {
            movement: [],
            action: [],
            attack: []
        }
        this.placement = []

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

}