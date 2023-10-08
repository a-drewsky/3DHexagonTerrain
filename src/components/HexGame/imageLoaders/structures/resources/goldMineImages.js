import ImageLoaderClass from '../../imageLoader'

import gold_mine_sheet from '../../../images/resources/gold_mine_sheet.png'

export default class GoldMineImagesClass extends ImageLoaderClass {

    constructor() {

        super(true)

        this.shadow = 'large_round_shadow'

        this.padding = {
            'resources_lte_100': [{x:0,y:11}, {x:0,y:11}, {x:0,y:11}, {x:0,y:11}, {x:0,y:11}, {x:0,y:11}],
            'resources_lte_75': [{x:0,y:13}, {x:0,y:13}, {x:0,y:13}, {x:0,y:13}, {x:0,y:13}, {x:0,y:13}],
            'resources_lte_50': [{x:0,y:18}, {x:0,y:18}, {x:0,y:18}, {x:0,y:18}, {x:0,y:18}, {x:0,y:18}],
            'resources_lte_25': [{x:0,y:18}, {x:0,y:18}, {x:0,y:18}, {x:0,y:18}, {x:0,y:18}, {x:0,y:18}]  
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
                image: gold_mine_sheet,
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