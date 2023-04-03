import ModifierImageLoaderClass from './modifierImageLoader'

export default class ModifierImagesBaseDataClass extends ModifierImageLoaderClass {

    constructor(shadow_sheet_list){

        super(shadow_sheet_list)

        this.spriteSize = {
            width: 1,
            height: 2
        }
        this.offset = {
            x: 0,
            y: 1
        }
        this.singleImageSize = {
            width: 1,
            height: 1.5
        }
        this.singleImageOffset = {
            x: 0,
            y: 0.5
        }
        this.modifierSize = {
            width: 1,
            height: 1.5
        }
        this.shadowSpriteSize = {
            width: 1,
            height: 1.5
        }
        this.shadowSize = {
            width: 2,
            height: 2
        }
        this.shadowOffset = {
            x: 0.5,
            y: 1
        }
    }

}