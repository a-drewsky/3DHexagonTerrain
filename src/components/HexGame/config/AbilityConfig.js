export default class AbilityConfig {

    /*
        damage: {
            slashing: 0,
            piercing: 0,
            blunt: 0,
            fire: 0,
            ice: 0,
            water: 0,
            earth: 0,
            electric: 0
        }
    */

    static basic_slash = {
        Name: 'Basic Slash',
        Description: 'Sword slashes',
        hit_effect: null,
        stats: {
            damage: {
                slashing: 25
            }
        }
    }

    static basic_arrow_shot = {
        Name: 'Basic Arrow Shot',
        Description: 'Arrow shoots',
        hit_effect: null,
        stats: {
            damage: {
                piercing: 20
            }
        }
    }


}