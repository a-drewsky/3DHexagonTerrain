import SheetImageLoaderClass from '../../../imageLoaderBaseClass/sheetImageLoader'

import savanna_tree from '../../../../images/props/savanna_tree.png'

import { DEFAULT_ROWS } from '../../../imageLoaderConstants'


export default class SavannaTreeImagesClass extends SheetImageLoaderClass {

    constructor() {

        super(true)

        this.shadow = 'savanna_tree_shadow'

        this.sheet_rows = { ...DEFAULT_ROWS }

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

        this.animation_rows = { ...DEFAULT_ROWS }

        this.animation_data = {
            default: [
                'default'
            ],
        }

    }

}