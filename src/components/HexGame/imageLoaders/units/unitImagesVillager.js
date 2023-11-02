
import attack_sheet from '../../images/units/villagerUnit/villager_unit_attack_sheet.png'
import death_sheet from '../../images/units/villagerUnit/villager_unit_death_sheet.png'
import mine_sheet from '../../images/units/villagerUnit/villager_unit_mine_sheet.png'
import walk_sheet from '../../images/units/villagerUnit/villager_unit_walk_sheet.png'
import idle_sheet from '../../images/units/villagerUnit/villager_unit_idle_sheet.png'

import icon_image from '../../images/units/villagerUnit/villager_unit_icon.png'

import SheetImageLoaderClass from '../imageLoaderBaseClass/sheetImageLoader'

export default class UnitImagesVillagerClass extends SheetImageLoaderClass {

    constructor() {

        super()

        this.shadow = 'medium_round_shadow'

        this.padding = [
            [{x: 10, y: 9}, {x: 10, y: 9}, {x: 10, y: 9}, {x: 10, y: 9}, {x: 10, y: 9}, {x: 10, y: 9}]
        ]

        this.icon = icon_image

        this.sheet_rows = {
            0: 'frontRight',
            1: 'frontLeft',
            2: 'front',
            3: 'backRight',
            4: 'backLeft',
            5: 'back'
        }

        this.sheet_data = {
            attack: {
                image: attack_sheet,
                size: { w: 1, h: 1.5 },
                offset: { x: 0, y: 0.5 },
                sprites: {
                    0: 'attack_1',
                    1: 'attack_2',
                    2: 'attack_3',
                    3: 'attack_4',
                    4: 'attack_5'
                }
            },
            death: {
                image: death_sheet,
                size: { w: 1, h: 1.5 },
                offset: { x: 0, y: 0.5 },
                sprites: {
                    0: 'hit_1',
                    1: 'hit_2',
                    2: 'hit_3',
                    3: 'death_1',
                    4: 'death_2'
                }
            },
            mine: {
                image: mine_sheet,
                size: { w: 1, h: 1.5 },
                offset: { x: 0, y: 0.5 },
                sprites: {
                    0: 'mine_1',
                    1: 'mine_2',
                    2: 'mine_3',
                    3: 'mine_4',
                    4: 'mine_5',
                    5: 'mine_6'
                }
            },
            walk: {
                image: walk_sheet,
                size: { w: 1, h: 1.5 },
                offset: { x: 0, y: 0.5 },
                sprites: {
                    0: 'walk_1',
                    1: 'walk_2',
                    2: 'jump_1',
                    3: 'jump_2'
                }
            },
            idle: {
                image: idle_sheet,
                size: { w: 1, h: 1.5 },
                offset: { x: 0, y: 0.5 },
                sprites: {
                    0: 'idle_1',
                    1: 'idle_2',
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
            idle: [
                'idle_1',
                'idle_2'
            ],
            walk: [
                'walk_1',
                'idle_1',
                'walk_2',
                'idle_1'
            ],
            jump: [
                'jump_1',
                'jump_2'
            ],
            mine: [
                'mine_1',
                'mine_2',
                'mine_3',
                'mine_4',
                'mine_5',
                'mine_6'
            ],
            attack: [
                'attack_1',
                'attack_2',
                'attack_3',
                'attack_4',
                'attack_5'
            ],
            hit: [
                'hit_1',
                'hit_2',
                'hit_3'
            ],
            death: [
                'death_1',
                'death_2',
                'death_2',
                'death_2'
            ]
        }

    }

}