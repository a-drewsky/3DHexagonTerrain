import SheetImageLoaderClass from '../../imageLoaderBaseClass/sheetImageLoader'

import savanna_tree from '../../../images/props/savanna_tree.png'


export default class SavannaTreeImagesClass extends SheetImageLoaderClass {

    constructor() {

        super(true)

        this.shadow = 'savanna_tree_shadow'
        
        this.padding = {
            'default': [{x:10,y:6}, {x:10,y:6}, {x:10,y:6}, {x:10,y:6}, {x:10,y:6}, {x:10,y:6}]
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
                image: savanna_tree,
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