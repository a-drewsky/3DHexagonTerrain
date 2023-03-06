import ImageLoaderClass from '../ImageLoader'

import shadow_sheet from '../../images/shadows/base_shadow_sheet.png'

import base_sheet from '../../images/bases/mainBase/main_base_sheet.png'

export default class MainBaseImagesClass extends ImageLoaderClass {

    constructor() {

        super(shadow_sheet)

        this.spriteSize = {
            width: 1,
            height: 1.5
        }

        this.spriteOffset = {
            x: 0,
            y: 0.5
        }

        this.shadowSize = {
            width: 2,
            height: 1.5
        }

        this.shadowOffset = {
            x: 0.5,
            y: 0.5
        }

        this.deadSpace = {
            'health_lte_100': [null, 16 / 32, null, 13 / 32, null, 16 / 32, null, 16 / 32, null, 13 / 32, null, 16 / 32],
            'health_lte_75': [null, 16 / 32, null, 13 / 32, null, 16 / 32, null, 16 / 32, null, 13 / 32, null, 16 / 32],
            'health_lte_50': [null, 16 / 32, null, 13 / 32, null, 16 / 32, null, 16 / 32, null, 13 / 32, null, 16 / 32],
            'health_lte_25': [null, 16 / 32, null, 13 / 32, null, 16 / 32, null, 16 / 32, null, 13 / 32, null, 16 / 32]
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
                image: base_sheet,
                spriteCount: 5,
                sprites: {
                    0: 'default_1',
                    1: 'default_2',
                    2: 'default_3',
                    3: 'default_4'
                }
            }
        }

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