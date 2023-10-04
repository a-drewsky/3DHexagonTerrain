import shadow_sheet from '../../images/shadows/arrow_shadow_sheet.png'

import projectile_sheet from '../../images/projectiles/arrow_projectile_sheet.png'

// import icon_image from '???'

import ImageLoaderClass from '../units/unitImageLoader'

export default class ProjectileImagesArrowClass extends ImageLoaderClass {

    constructor() {

        super(shadow_sheet)

        this.shadowSize = {
            width: 1,
            height: 1.5
        }

        this.shadowOffset = {
            x: 0,
            y: 0.5
        }

        this.padding = [
            [{x: 10, y: 9}, {x: 10, y: 9}, {x: 10, y: 9}, {x: 10, y: 9}, {x: 10, y: 9}, {x: 10, y: 9}]
        ]

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