import ProjectileImagesArrowClass from "./projectileImagesArrow";

export default class ProjectileImagesClass {

    constructor(){
        this.loaders = [
            this.arrow = new ProjectileImagesArrowClass()
        ]
    }

    loadImages = (startGame) => {

        let totalLoaded = 0;
        let testLoaded = () => {
            totalLoaded++
            if (totalLoaded == this.loaders.length) startGame()
        }

        for (let loader of this.loaders) {
            loader.loadImages(testLoaded)
        }

    }

}