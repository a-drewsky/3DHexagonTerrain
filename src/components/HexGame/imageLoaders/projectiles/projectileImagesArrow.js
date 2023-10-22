import shadow_sheet from '../../images/shadows/arrow_shadow_sheet.png'

import projectile_sheet from '../../images/projectiles/arrow_projectile_sheet.png'

// import icon_image from '???'

import ImageLoaderClass from '../imageLoader'

export default class ProjectileImagesArrowClass extends ImageLoaderClass {

    constructor() {

        super()

        this.shadow = 'projectile_shadow'

        // this.icon = icon_image

        this.sheet_rows = {
             0: 'backRight',
             1: 'right',
             2: 'frontRight',
             3: 'frontFrontRight',
             4: 'front',
             5: 'frontFrontLeft',
             6: 'frontLeft',
             7: 'left',
             8: 'backLeft',
             9: 'backBackLeft',
            10: 'back',
            11: 'backBackRight',
        }

        this.sheet_data = {
            projectile: {
                image: projectile_sheet,
                size: { w: 1, h: 1.5 },
                offset: { x: 0, y: 0.5 },
                sprites: {
                    0: 'default',
                }
            }
        }

        this.animation_rows = {
            0: 'backRight',
            1: 'right',
            2: 'frontRight',
            3: 'frontFrontRight',
            4: 'front',
            5: 'frontFrontLeft',
            6: 'frontLeft',
            7: 'left',
            8: 'backLeft',
            9: 'backBackLeft',
           10: 'back',
           11: 'backBackRight',
        }

        this.animation_data = {
            default: ['default']
        }

    }

}