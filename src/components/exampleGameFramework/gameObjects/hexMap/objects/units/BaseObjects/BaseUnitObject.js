import BaseUnitDataClass from "./BaseUnitData"

export default class BaseUnitObjectClass {

    constructor(pos){
        this.data = new BaseUnitDataClass(pos)
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