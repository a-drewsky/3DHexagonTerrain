
import ImageLoaderClass from '../../imageLoader'

import large_rock from '../../../images/props/large_rock.png'

export default class LargeRockImagesClass extends ImageLoaderClass {

    constructor() {

        super(true)

        this.shadow = 'large_round_shadow'

        this.padding = {
            'default': [{x:0,y:11}, {x:0,y:11}, {x:0,y:11}, {x:0,y:11}, {x:0,y:11}, {x:0,y:11}]
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