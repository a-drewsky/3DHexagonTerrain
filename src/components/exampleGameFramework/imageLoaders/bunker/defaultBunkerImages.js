import ImageLoaderClass from '../ImageLoader'

import shadow_sheet from '../../images/shadows/base_shadow_sheet.png'

import bunker_sheet from '../../images/bases/base/base_sheet.png'

export default class DefaultBunkerImagesClass extends ImageLoaderClass {

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

        this.padding = {
            'health_lte_100': [null, {x: 0, y: 16}, null, {x: 0, y: 13}, null, {x: 0, y: 16}, null, {x: 0, y: 16}, null, {x: 0, y: 13}, null, {x: 0, y: 16}],
            'health_lte_75': [null, {x: 0, y: 16}, null, {x: 0, y: 13}, null, {x: 0, y: 16}, null, {x: 0, y: 16}, null, {x: 0, y: 13}, null, {x: 0, y: 16}],
            'health_lte_50': [null, {x: 0, y: 16}, null, {x: 0, y: 13}, null, {x: 0, y: 16}, null, {x: 0, y: 16}, null, {x: 0, y: 13}, null, {x: 0, y: 16}],
            'health_lte_25': [null, {x: 0, y: 16}, null, {x: 0, y: 13}, null, {x: 0, y: 16}, null, {x: 0, y: 16}, null, {x: 0, y: 13}, null, {x: 0, y: 16}]
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
                image: bunker_sheet,
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