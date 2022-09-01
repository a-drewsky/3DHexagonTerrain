import StateManagerClass from './StateManager';
import UIElementManagerClass from './UIElementManager';
import GameObjectManagerClass from './GameObjectManager';

export default class GameManagerClass {

    constructor(ctx, canvas, settings, images) {
        this.objects = new GameObjectManagerClass(ctx, canvas, settings, images);
        this.ui = new UIElementManagerClass(ctx, canvas);
        this.state = new StateManagerClass(this.objects, this.ui);
    }

}