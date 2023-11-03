import SheetImageLoaderClass from '../../../imageLoaderBaseClass/sheetImageLoader'

import bunker_sheet from '../../../../images/bases/base/base_sheet.png'

import { DEFAULT_ROWS } from '../../../imageLoaderConstants'

export default class DefaultBunkerImagesClass extends SheetImageLoaderClass {

    constructor() {

        super(false)

        this.shadow = 'base_shadow'

        this.sheet_rows = { ...DEFAULT_ROWS }

        this.sheet_data = {
            default: {
                image: bunker_sheet,
                size: {w: 1, h: 1.5},
                offset: {x: 0, y: 0.5},
                sprites: {
                    0: 'default_1',
                    1: 'default_2',
                    2: 'default_3',
                    3: 'default_4'
                }
            }
        }

        this.animation_rows = { ...DEFAULT_ROWS }

        this.animation_data = {
            health_lte_100: [
                'default_1'
            ],
            health_lte_75: [
                'default_2'
            ],
            health_lte_50: [
                'default_3'
            ],
            health_lte_25: [
                'default_4'
            ]
        }

    }

}