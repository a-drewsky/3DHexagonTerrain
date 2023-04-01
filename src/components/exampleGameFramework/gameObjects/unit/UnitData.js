export default class UnitDataClass {

    constructor(pos, hexMapData, imageObject){
        
        this.position = {
            q: pos.q,
            r: pos.r
        }
        
        //static data
        this.name = 'Villager'
        this.type = 'unit'
        this.tileHeight = 3

        //image data
        this.sprite = 'villager'
        this.images = []
        this.shadowImages = []
        this.imageObject = imageObject

        this.canvasSize = {
           width: hexMapData.size * 2 * this.imageObject.spriteSize.width,
           height: hexMapData.size * 2 * this.imageObject.spriteSize.height
        }


        //stats
        this.stats = {
            movement: 5,
            baseHealth: 100
        }
        this.health = this.stats.baseHealth

        //animation data
        this.rotation = 5
        this.frame = 0
        this.frameStartTime = Date.now()
        this.frameCurTime = Date.now()

        this.path = []
        this.destination = null
        this.destinationStartTime = null
        this.destinationCurTime = null
        this.target = null
        this.animationStartTime = null
        this.animationCurTime = null
        this.futureState = null

        this.state = {
            idle: { name: 'idle', rate: 'static', duration: 'continuous', type: 'static' },
            walk: { name: 'walk', rate: 150, duration: 'continuous', type: 'moving' },
            jump: { name: 'jump', rate: 250, duration: 'continuous', type: 'moving' },
            mine: { name: 'mine', rate: 150, duration: 1800, type: 'action' },
            attack: { name: 'attack', rate: 150, duration: 750, type: 'action' },
            hit: { name: 'hit', rate: 300, duration: 900, type: 'action' },
            death: { name: 'death', rate: 150, duration: 600, type: 'action' }
        }
        this.state.current = this.state.idle

    }
    
    setFrame = () => {
        this.frameCurTime = Date.now()
        if (this.state.current.rate == 'static') return
        if (this.frameCurTime - this.frameStartTime > this.state.current.rate) {
            this.frameStartTime = Date.now()

            this.frame++

            if (this.frame >= this.images.unit[this.sprite][this.state.current.name].images.length) this.frame = 0
        }
    }

}