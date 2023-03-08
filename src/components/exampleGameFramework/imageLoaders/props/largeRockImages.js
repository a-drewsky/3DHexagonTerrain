import ImageLoaderClass from '../ImageLoader'

import large_rock from '../../images/props/large_rock.png'

import shadow_sheet from '../../images/shadows/large_round_shadow_sheet.png'


export default class LargeRockImagesClass extends ImageLoaderClass {

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
            width: 2,
            height: 1.5
        }

        this.shadowOffset = {
            x: 0.5,
            y: 0.5
        }

        this.padding = {
            'default': [null, {x:0,y:11}, null, {x:0,y:11}, null, {x:0,y:11}, null, {x:0,y:11}, null, {x:0,y:11}, null, {x:0,y:11}]
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
                image: large_rock,
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