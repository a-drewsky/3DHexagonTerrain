import SheetImageLoaderClass from '../../../imageLoaderBaseClass/sheetImageLoader'

import flag from '../../../../images/flags/flag.png'

import { DEFAULT_ROWS } from '../../../imageLoaderConstants'

export default class DefaultFlagImagesClass extends SheetImageLoaderClass {

    constructor() {

        super(true)

        this.sheet_rows = { ...DEFAULT_ROWS }

        this.sheet_data = {
            default: {
                image: flag,
                size: {w: 1, h: 1.5},
                offset: {x: 0, y: 0.5},
                sprites: {
                    0: 'default'
                }
            }
        }

        this.animation_rows = { ...DEFAULT_ROWS }

        this.animation_data = {
            default: [
                'default'
            ],
            captured: [
                'default'
            ],
        }

    }

}