import ImageLoaderUtilsClass from "../utils/imageLoaderUtils"

export default class UiImageLoaderClass {

    constructor(sprite_sheet) {
        this.sprite_sheet = sprite_sheet
        this.utils = new ImageLoaderUtilsClass()
    }

    loadImages = (startGame) => {

        this.createSheetImages()

        let imagesLoaded = 0;
        for (let [key, value] of Object.entries(this.images)) {
            this[key] = value;
            value.onload = () => {
                imagesLoaded++;
                if (imagesLoaded == Object.keys(this.images).length) {
                    delete this.images;
                    this.assignImages(startGame)
                }
            }
        }

        this.loadSheetImages()

    }

    createSheetImages = () => {

        if (this.images === undefined) this.images = {}

        for (let col = 1; col <= this.spriteCount; col++) {

            this.images[this.spriteName + '_' + col] = new Image()
        }

    }

    loadSheetImages = () => {

        let sheet = new Image()

        sheet.onload = () => {
            
            let imageDims = {
                width: sheet.width / this.spriteCount,
                height: sheet.height
            }

            for (let col = 1; col <= this.spriteCount; col++) {

                let tempCanvas = document.createElement('canvas')
                tempCanvas.width = imageDims.width
                tempCanvas.height = imageDims.height
                let tempctx = tempCanvas.getContext('2d')

                tempctx.drawImage(sheet, imageDims.width * col, 0, imageDims.width, imageDims.height, 0, 0, imageDims.width, imageDims.height)

                tempCanvas = this.utils.upscale(tempCanvas)

                let image = tempCanvas.toDataURL('image/png');

                this[this.spriteName + '_' + col].src = image


            }
            
        }
        sheet.src = this.sprite_sheet
    }

    assignImages = (startGame) => {

        this.images = []

        for (let i = 1; i <= this.spriteCount; i++) {

            this.images.push(this[this.spriteName + '_' + i])
            
        }

        startGame();
    }

}