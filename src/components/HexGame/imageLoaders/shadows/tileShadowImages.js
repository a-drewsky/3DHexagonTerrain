import tile_shadows from '../../images/shadows/tile_shadows/tile_shadows_sheet.png'
import tile_side_shadows from '../../images/shadows/tile_shadows/tile_side_shadows_sheet.png'
import advanced_tile_side_shadows from '../../images/shadows/tile_shadows/advanced_side_tile_shadows_sheet.png'
import TileShadowImageLoaderClass from './tileShadowImageLoader'

export default class TileShadowImagesClass extends TileShadowImageLoaderClass {

    constructor(){

        super()

        this.rows = {
            0: 'backRight',
            1: 'frontRight',
            2: 'front',
            3: 'frontLeft',
            4: 'backLeft',
            5: 'back'
        }

        this.tile_side_shadows = tile_side_shadows

        this.adv_tile_side_shadows = advanced_tile_side_shadows

        this.tile_shadows = tile_shadows

        this.shadow_permutations = {
             0: { l: 1, c: 0, r: 0 },
             1: { l: 2, c: 0, r: 0 },
             2: { l: 0, c: 0, r: 1 },
             3: { l: 0, c: 0, r: 2 },
             4: { l: 1, c: 0, r: 1 },
             5: { l: 2, c: 0, r: 1 },
             6: { l: 1, c: 0, r: 2 },
             7: { l: 2, c: 0, r: 2 },
             8: { l: 0, c: 1, r: 0 },
             9: { l: 1, c: 1, r: 0 },
            10: { l: 2, c: 1, r: 0 },
            11: { l: 0, c: 1, r: 1 },
            12: { l: 0, c: 1, r: 2 },
            13: { l: 1, c: 1, r: 1 },
            14: { l: 2, c: 1, r: 1 },
            15: { l: 1, c: 1, r: 2 },
            16: { l: 2, c: 1, r: 2 },
            17: { l: 0, c: 2, r: 0 }
        }

        this.adv_side_shadow_permutations = {
             0: { l: 0, c: 1, r: 0 },
             1: { l: 0, c: 2, r: 0 },
             2: { l: 1, c: 0, r: 0 },
             3: { l: 1, c: 1, r: 0 },
             4: { l: 1, c: 2, r: 0 },
             5: { l: 0, c: 0, r: 1 },
             6: { l: 0, c: 1, r: 1 },
             7: { l: 0, c: 2, r: 1 },
             8: { l: 1, c: 0, r: 1 },
             9: { l: 0, c: 3, r: 0 }
       }

    }

}