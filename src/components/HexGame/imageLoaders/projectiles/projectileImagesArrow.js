import projectile_sheet from '../../images/projectiles/arrow_projectile_sheet.png'

import SheetImageLoaderClass from '../imageLoaderBaseClass/sheetImageLoader'

export default class ProjectileImagesArrowClass extends SheetImageLoaderClass {

    constructor() {

        super()

        this.sheet_rows = {
            0: 'backRight',
            1: 'frontRight',
            2: 'front',
            3: 'frontLeft',
            4: 'backLeft',
            5: 'back',
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
            1: 'frontRight',
            2: 'front',
            3: 'frontLeft',
            4: 'backLeft',
            5: 'back',
        }

        this.animation_data = {
            default: ['default']
        }

    }

}