
import attack_sheet from '../../images/units/villagerUnit/villager_unit_attack_sheet.png'
import death_sheet from '../../images/units/villagerUnit/villager_unit_death_sheet.png'
import mine_sheet from '../../images/units/villagerUnit/villager_unit_mine_sheet.png'
import walk_sheet from '../../images/units/villagerUnit/villager_unit_walk_sheet.png'
import idle_sheet from '../../images/units/villagerUnit/villager_unit_idle_sheet.png'

import icon_image from '../../images/units/villagerUnit/villager_unit_icon.png'

import SheetImageLoaderClass from '../imageLoaderBaseClass/sheetImageLoader'

import {
    DEFAULT_ROWS,
    DEFUALT_UNIT_ROWS,
    DEFUALT_ATTACK_SPRITES,
    DEFAULT_DEATH_SPRITES,
    DEFAULT_MINING_SPRITES,
    DEFAULT_WALK_SPRITES,
    DEFAULT_IDLE_SPRITES
} from '../imageLoaderConstants'

export default class UnitImagesVillagerClass extends SheetImageLoaderClass {

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
                sprites: { ...DEFAULT_MINING_SPRITES }
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
            mine: ['mine_1', 'mine_2', 'mine_3', 'mine_4', 'mine_5', 'mine_6'],
            attack: ['attack_1', 'attack_2', 'attack_3'],
            post_attack: ['attack_4', 'attack_5'],
            hit: ['hit_1', 'hit_2', 'hit_3'],
            death: ['death_1', 'death_2', 'death_2', 'death_2'],
            capture: ['idle_1', 'idle_2']
        }

    }

}