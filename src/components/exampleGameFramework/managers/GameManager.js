import StateManagerClass from './StateManager';
import GameObjectManagerClass from './GameObjectManager';

export default class GameManagerClass {

    constructor(ctx, canvas, settings, images) {
        this.objects = new GameObjectManagerClass(ctx, canvas, settings, images);
        this.state = new StateManagerClass(this.objects);
    }

}