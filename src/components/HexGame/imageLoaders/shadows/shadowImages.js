
import projectile_shadow_sheet from '../../images/shadows/arrow_shadow_sheet.png'
import base_shadow_sheet from '../../images/shadows/base_shadow_sheet.png'
import savanna_tree_shadow_sheet from '../../images/shadows/savanna_tree_shadow_sheet.png'
import large_round_shadow_sheet from '../../images/shadows/large_round_shadow_sheet.png'
import medium_round_shadow_sheet from '../../images/shadows/medium_round_shadow_sheet.png'
import small_round_shadow_sheet from '../../images/shadows/small_round_shadow_sheet.png'

import ShadowSheetImageLoaderClass from './shadowImageLoader'

import { DEFAULT_ROWS } from '../imageLoaderConstants'

export default class ShadowImagesClass extends ShadowSheetImageLoaderClass {

    constructor(){

        super()

        this.rows = { ...DEFAULT_ROWS }

        this.sheetData = {
            projectile_shadow: {
                image: projectile_shadow_sheet,
                size: {w: 1, h: 1.5},
                offset: {x: 0, y: 0.5}
            },
            base_shadow:{
                image: base_shadow_sheet,
                size: {w: 2, h: 1.5},
                offset: {x: 0.5, y: 0.5}
            }, 
            savanna_tree_shadow: {
                image: savanna_tree_shadow_sheet,
                size: {w: 2, h: 1.5},
                offset: {x: 0.5, y: 0.5}
            }, 
            large_round_shadow: {
                image: large_round_shadow_sheet,
                size: {w: 2, h: 1.5},
                offset: {x: 0.5, y: 0.5}
            }, 
            medium_round_shadow: {
                image: medium_round_shadow_sheet,
                size: {w: 1, h: 1.5},
                offset: {x: 0, y: 0.5}
            },
            small_round_shadow: {
                image: small_round_shadow_sheet,
                size: {w: 1, h: 1.5},
                offset: {x: 0, y: 0.5}
            },
        }

    }

}