import SheetImageLoaderClass from '../../../imageLoaderBaseClass/sheetImageLoader'

import jade_mine_sheet from '../../../../images/resources/jade_mine_sheet.png'

import { DEFAULT_ROWS, DEFAULT_RESOURCE_SPRITES, DEFAULT_RESOURCE_ANIMATION } from '../../../imageLoaderConstants'

export default class JadeMineImagesClass extends SheetImageLoaderClass {

    constructor() {

        super(true)

        this.sheet_rows = { ...DEFAULT_ROWS }

        this.sheet_data = {
            default: {
                image: jade_mine_sheet,
                size: {w: 1, h: 1.5},
                offset: {x: 0, y: 0.5},
                sprites: { ...DEFAULT_RESOURCE_SPRITES }
            }
        }

        this.animation_rows = { ...DEFAULT_ROWS }

        this.animation_data = { ...DEFAULT_RESOURCE_ANIMATION }

    }

}