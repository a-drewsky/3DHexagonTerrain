import SheetImageLoaderClass from '../../imageLoaderBaseClass/sheetImageLoader'

import flag from '../../../images/flags/flag.png'

export default class DefaultFlagImagesClass extends SheetImageLoaderClass {

    constructor() {

        super(true)

        this.shadow = 'small_round_shadow'

        this.padding = {
            'default': [{x: 0, y: 3}, {x: 0, y: 3}, {x: 0, y: 3}, {x: 0, y: 3}, {x: 0, y: 3}, {x: 0, y: 3}]
        }

        this.sheet_rows = {
            0: 'backRight',
            1: 'frontRight',
            2: 'front',
            3: 'frontLeft',
            4: 'backLeft',
            5: 'back'
        }

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

        this.animation_rows = {
            0: 'backRight',
            1: 'frontRight',
            2: 'front',
            3: 'frontLeft',
            4: 'backLeft',
            5: 'back'
        }

        this.animation_data = {
            default: [
                'default'
            ],
        }

    }

}