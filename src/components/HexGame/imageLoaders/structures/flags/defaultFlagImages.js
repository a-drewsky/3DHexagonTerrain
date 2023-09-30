import ImageLoaderClass from '../../ImageLoader'

import flag from '../../../images/bases/mainBase/main_base_q0r0.png'

import shadow_sheet from '../../../images/shadows/small_round_shadow_sheet.png'

export default class DefaultFlagImagesClass extends ImageLoaderClass {

    constructor() {

        super(shadow_sheet, true)

        this.spriteSize = {
            width: 1,
            height: 1.5
        }

        this.spriteOffset = {
            x: 0,
            y: 0.5
        }

        this.shadowSize = {
            width: 1,
            height: 1.5
        }

        this.shadowOffset = {
            x: 0,
            y: 0.5
        }

        this.padding = {
            'default': [null, {x: 0, y: 3}, null, {x: 0, y: 3}, null, {x: 0, y: 3}, null, {x: 0, y: 3}, null, {x: 0, y: 3}, null, {x: 0, y: 3}]
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