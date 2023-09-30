import ImageLoaderClass from '../../ImageLoader'

import ruby_mine_sheet from '../../../images/resources/ruby_mine_sheet.png'

import shadow_sheet from '../../../images/shadows/large_round_shadow_sheet.png'

export default class RubyMineImagesClass extends ImageLoaderClass {

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
            'resources_lte_100': [null, {x:0,y:11}, null, {x:0,y:11}, null, {x:0,y:11}, null, {x:0,y:11}, null, {x:0,y:11}, null, {x:0,y:11}],
            'resources_lte_75': [null, {x:0,y:13}, null, {x:0,y:13}, null, {x:0,y:13}, null, {x:0,y:13}, null, {x:0,y:13}, null, {x:0,y:13}],
            'resources_lte_50': [null, {x:0,y:18}, null, {x:0,y:18}, null, {x:0,y:18}, null, {x:0,y:18}, null, {x:0,y:18}, null, {x:0,y:18}],
            'resources_lte_25': [null, {x:0,y:18}, null, {x:0,y:18}, null, {x:0,y:18}, null, {x:0,y:18}, null, {x:0,y:18}, null, {x:0,y:18}]  
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
                image: ruby_mine_sheet,
                sprites: {
                    0: 'default_1',
                    1: 'default_2',
                    2: 'default_3',
                    3: 'default_4'
                }
            }
        }

        this.animation_data = {
            resources_lte_100: [
                'default_1'
            ],
            resources_lte_75: [
                'default_2'
            ],
            resources_lte_50: [
                'default_3'
            ],
            resources_lte_25: [
                'default_4'
            ]
        }

    }

}