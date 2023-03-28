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
    }

    getPosition = (selection) => {
        return this[selection]
    }
    
    getSelection = (q, r) => {
        if(this.hover && this.hover.q == q && this.hover.r == r) return 'hover'
        if(this.tile && this.tile.q == q && this.tile.r == r) return 'tile'
        if(this.unit && this.unit.q == q && this.unit.r == r) return 'unit'
        if(this.target && this.target.q == q && this.target.r == r) return 'target'
        if(this.path.some(val => val.q == q && val.r == r)) return 'path'
        if(this.pathing.movement.some(val => val.q == q && val.r == r)) return 'movement'
        if(this.pathing.action.some(val => val.q == q && val.r == r)) return 'action'
        if(this.pathing.attack.some(val => val.q == q && val.r == r)) return 'attack'
        return null
    }

    setSelection = (q, r, selection) => {
        this[selection] = { q: q, r: r }
    }

    setPathingSelections = (pathing) => {
        this.pathing = pathing
    }

    resetSelected = () => {
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
    }

    resetHover = () => {
        this.hover = null
    }

}