import PixelButtonDataClass from "./PixelButtonData";
import PixelButtonViewClass from "./PixelButtonView";
import PixelButtonCotnrollerClass from "./PixelButtonController";

export default class PixelButtonElement {

    constructor(ctx, text, x, y, width, height, radius, pixelSize, font, colorList) {
        this.data = new PixelButtonDataClass(text, x, y, width, height, radius, pixelSize, font, colorList);
        this.controller = new PixelButtonCotnrollerClass(this.data);
        this.view = new PixelButtonViewClass(ctx, this.data);
    }

    update = () => {
        
    }

}