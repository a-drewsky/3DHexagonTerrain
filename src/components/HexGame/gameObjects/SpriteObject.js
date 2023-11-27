export default class SpriteObjectClass {

    constructor(spriteType, id, stateObj, initState, position, height, imageObject, shadowImageObject){

        //animation data
        this.render = true
        this.frame = 0
        this.frameStartTime = Date.now()
        this.frameCurTime = Date.now()
        this.animationStartTime = null
        this.animationCurTime = null

        //positional data
        this.position = { ...position }
        this.rotation = 0

        //sprite data
        this.id = id
        this.spriteType = spriteType
        this.state = { ...stateObj }
        this.state.current = this.state[initState]
        this.height = height
        this.imageObject = imageObject
        this.shadowImageObject = shadowImageObject
    }

    //GET functions
    curState = () => {
        return this.state.current.name
    }

    //modifier needs to overwrite this
    sprite = (cameraRotation) => {
        return this.imageObject[this.curState()].images[this.frame][this.spriteRotation(cameraRotation)]
    }

    spriteRotation = (cameraRotation) => {
        let spriteRotation = this.rotation + cameraRotation
        if (spriteRotation >= 6) spriteRotation -= 6
        return spriteRotation
    }

    //SET functions
    setDirection = (targetPos) => {
        this.render = true
        this.rotation = this.commonUtils.getDirection(this.position, targetPos)
    }

    setPosition = (position) => {
        this.render = true
        this.position = position
    }

    setFrame = () => {
        this.frameCurTime = Date.now()
        this.animationCurTime = Date.now()
        if (this.state.current.rate === 0) return
        if (this.frameCurTime - this.frameStartTime > this.state.current.rate) {
            this.render = true
            this.frameStartTime = Date.now()

            this.frame++
            if (this.frame >= this.imageObject[this.curState()].images.length) this.frame = 0
        }

    }

}