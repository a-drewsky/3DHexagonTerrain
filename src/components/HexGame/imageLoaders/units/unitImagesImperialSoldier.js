
import attack_sheet from '../../images/units/imperialSoldier/imperial_swordsman_attack_sheet.png'
import death_sheet from '../../images/units/imperialSoldier/imperial_swordsman_death_sheet.png'
import mine_sheet from '../../images/units/imperialSoldier/imperial_swordsman_mine_sheet.png'
import walk_sheet from '../../images/units/imperialSoldier/imperial_swordsman_walk_sheet.png'
import idle_sheet from '../../images/units/imperialSoldier/imperial_swordsman_idle_sheet.png'

import icon_image from '../../images/ui/cardIcons/imperial_swordsman_icon.png'

import SheetImageLoaderClass from '../imageLoaderBaseClass/sheetImageLoader'

import {
    DEFAULT_ROWS,
    DEFUALT_UNIT_ROWS,
    DEFUALT_ATTACK_SPRITES,
    DEFAULT_DEATH_SPRITES,
    DEFAULT_WALK_SPRITES,
    DEFAULT_IDLE_SPRITES
} from '../imageLoaderConstants'

export default class UnitImagesImperialSoldierClass extends SheetImageLoaderClass {

    constructor() {

        super()

        this.icon = icon_image

        this.sheet_rows = { ...DEFUALT_UNIT_ROWS }

        this.sheet_data = {
            attack: {
                image: attack_sheet,
                size: { w: 1, h: 1.5 },
                offset: { x: 0, y: 0.5 },
                sprites: { ...DEFUALT_ATTACK_SPRITES }
            },
            death: {
                image: death_sheet,
                size: { w: 1, h: 1.5 },
                offset: { x: 0, y: 0.5 },
                sprites: { ...DEFAULT_DEATH_SPRITES }
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
                    5: 'mine_6',
                    6: 'mine_7'
                }
            },
            walk: {
                image: walk_sheet,
                size: { w: 1, h: 1.5 },
                offset: { x: 0, y: 0.5 },
                sprites: { ...DEFAULT_WALK_SPRITES }
            },
            idle: {
                image: idle_sheet,
                size: { w: 1, h: 1.5 },
                offset: { x: 0, y: 0.5 },
                sprites: { ...DEFAULT_IDLE_SPRITES }
            }
        }

        this.animation_rows = { ...DEFAULT_ROWS }

        this.animation_data = {
            idle: ['idle_1', 'idle_2'],
            walk: ['walk_1', 'idle_1', 'walk_2', 'idle_1'],
            jump: ['jump_1', 'jump_2'],
            mine: ['mine_1', 'mine_2', 'mine_3', 'mine_4', 'mine_5', 'mine_6', 'mine_7'],
            attack: ['attack_1', 'attack_2', 'attack_3'],
            post_attack: ['attack_4', 'attack_5'],
            hit: ['hit_1', 'hit_2', 'hit_3'],
            death: ['death_1', 'death_2', 'death_2', 'death_2'],
            capture: ['idle_1', 'idle_2']
        }

    }

}