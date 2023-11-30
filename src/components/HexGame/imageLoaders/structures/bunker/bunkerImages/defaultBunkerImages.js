import SheetImageLoaderClass from '../../../imageLoaderBaseClass/sheetImageLoader'

import bunker_sheet from '../../../../images/bases/base/base_sheet.png'

import { DEFAULT_ROWS, DEFAULT_BUNKER_SPRITES, DEFAULT_BUNKER_ANIMATION } from '../../../imageLoaderConstants'

export default class DefaultBunkerImagesClass extends SheetImageLoaderClass {

    constructor() {

        super(false)

        this.sheet_rows = { ...DEFAULT_ROWS }

        this.sheet_data = {
            default: {
                image: bunker_sheet,
                size: {w: 1, h: 1.5},
                offset: {x: 0, y: 0.5},
                sprites: { ...DEFAULT_BUNKER_SPRITES }
            }
        }

        this.animation_rows = { ...DEFAULT_ROWS }

        this.animation_data = { ...DEFAULT_BUNKER_ANIMATION }

    }

}