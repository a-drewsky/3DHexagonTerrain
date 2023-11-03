import SheetImageLoaderClass from '../../../imageLoaderBaseClass/sheetImageLoader'

import large_rock from '../../../../images/props/large_rock.png'

import { DEFAULT_ROWS } from '../../../imageLoaderConstants'

export default class LargeRockImagesClass extends SheetImageLoaderClass {

    constructor() {

        super(true)

        this.shadow = 'large_round_shadow'

        this.sheet_rows = { ...DEFAULT_ROWS }

        this.sheet_data = {
            default: {
                image: large_rock,
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
        }

    }

}