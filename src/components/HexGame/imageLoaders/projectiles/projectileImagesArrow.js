import shadow_sheet from '../../images/shadows/arrow_shadow_sheet.png'

import projectile_sheet from '../../images/projectiles/arrow_projectile_sheet.png'

// import icon_image from '???'

import ImageLoaderClass from '../imageLoader'

export default class ProjectileImagesArrowClass extends ImageLoaderClass {

    constructor() {

        super()

        this.shadow = 'projectile_shadow'

        // this.icon = icon_image

        this.rows = {
            0: 'frontRight',
            1: 'frontLeft',
            2: 'front',
            3: 'backRight',
            4: 'backLeft',
            5: 'back'
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

        this.animation_data = {
            default: ['default']
        }

    }

}