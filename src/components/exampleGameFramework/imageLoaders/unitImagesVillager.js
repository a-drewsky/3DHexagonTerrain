import ImageLoaderClass from './ImageLoader'

import shadow_sheet from '../images/shadows/medium_round_shadow_sheet.png'

import attack_sheet from '../images/units/villagerUnit/villager_unit_attack_sheet.png'
import death_sheet from '../images/units/villagerUnit/villager_unit_death_sheet.png'
import mine_sheet from '../images/units/villagerUnit/villager_unit_mine_sheet.png'
import walk_sheet from '../images/units/villagerUnit/villager_unit_walk_sheet.png'

export default class UnitImagesVillagerClass extends ImageLoaderClass {

    constructor() {

        super(shadow_sheet)

        this.spriteSize = {
            width: 1,
            height: 1.5
        }

        this.spriteOffset = {
            x: 0,
            y: 0.5
        }

        this.shadowSize = {
            width: 1,
            height: 1.5
        }

        this.shadowOffset = {
            x: 0,
            y: 0.5
        }

        this.deadSpace = [
            [null, 9 / 32, null, 9 / 32, null, 9 / 32, null, 9 / 32, null, 9 / 32, null, 9 / 32]
        ]

        this.rows = {
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
                sprites: {
                    0: 'idle_1',
                    1: 'walk_1',
                    2: 'walk_2',
                    3: 'jump_1',
                    4: 'jump_2'
                }
            }
        }

        this.animation_data = {
            idle: [
                'idle_1'
            ],
            walk: [
                'walk_1',
                'idle_1',
                'walk_2',
                'idle_1'
            ],
            jumpUp: [
                'jump_1'
            ],
            jumpDown: [
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