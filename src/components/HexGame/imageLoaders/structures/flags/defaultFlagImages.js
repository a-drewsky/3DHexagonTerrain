import ImageLoaderClass from '../../imageLoader'

import flag from '../../../images/bases/mainBase/main_base_q0r0.png'

export default class DefaultFlagImagesClass extends ImageLoaderClass {

    constructor() {

        super(true)

        this.shadow = 'small_round_shadow'

        this.padding = {
            'default': [{x: 0, y: 3}, {x: 0, y: 3}, {x: 0, y: 3}, {x: 0, y: 3}, {x: 0, y: 3}, {x: 0, y: 3}]
        }

        this.rows = {
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

        this.animation_data = {
            default: [
                'default'
            ],
        }

    }

}