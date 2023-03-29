import UnitDataClass from "./UnitData"
import UnitRendererClass from "./UnitRenderer"
import UnitViewClass from "./UnitView"

export default class UnitObjectClass {

    constructor(pos){
        this.data = new UnitDataClass(pos)
        this.renderer = new UnitRendererClass()
        this.view = new UnitViewClass()
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