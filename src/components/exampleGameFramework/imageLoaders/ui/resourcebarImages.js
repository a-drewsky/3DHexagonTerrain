import UiImageLoaderClass from './uiImageLoader'

import sprite_sheet from '../../images/ui/resourcebar_sheet.png'

export default class HealthbarImagesClass extends UiImageLoaderClass {

    constructor() {

        super(sprite_sheet)

        this.spriteSize = {
            width: 1,
            height: 1.5
        }

        this.spriteOffset = {
            x: 0,
            y: 0.5
        }

        this.spriteName = 'resourcebar'

        this.spriteCount = 11

    }

}