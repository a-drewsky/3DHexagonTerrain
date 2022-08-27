import StateManagerClass from './StateManager';
import UIElementManagerClass from './UIElementManager';
import GameObjectManagerClass from './GameObjectManager';

export default class GameManagerClass {

    constructor(ctx, canvas, drawMethod, intervalList, settings, images) {
        this.objects = new GameObjectManagerClass(ctx, canvas, settings, images);
        this.ui = new UIElementManagerClass(ctx, canvas);
        this.state = new StateManagerClass(drawMethod, intervalList, this.objects, this.ui);
    }

}