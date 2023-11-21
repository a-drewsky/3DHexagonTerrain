import SheetImageLoaderClass from '../../../imageLoaderBaseClass/sheetImageLoader'

import ruby_mine_sheet from '../../../../images/resources/ruby_mine_sheet.png'

import { DEFAULT_ROWS } from '../../../imageLoaderConstants'

export default class RubyMineImagesClass extends SheetImageLoaderClass {

    constructor() {

        super(true)

        this.sheet_rows = { ...DEFAULT_ROWS }

        this.sheet_data = {
            default: {
                image: ruby_mine_sheet,
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

        this.animation_rows = { ...DEFAULT_ROWS }

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