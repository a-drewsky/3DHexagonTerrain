import ImageLoaderUtilsClass from "../utils/imageLoaderUtils"

export default class ShadowSheetImageLoaderClass {

    constructor(){
        this.utils = new ImageLoaderUtilsClass()
    }

    loadImages = (startGame) => {

        this.createSheetImages()

        let imagesLoaded = 0
        for (let [key, value] of Object.entries(this.images)) {
            this[key] = value
            value.image.onload = () => {
                imagesLoaded++
                if (imagesLoaded == Object.keys(this.images).length) {
                    delete this.images
                    this.assignImages(startGame)
                }
            }
        }

        this.loadSheetImages()

    }

    assignImages = (startGame) => {

        for(let sheetName in this.sheetData){

            this[sheetName] = [ this['backRight_' + sheetName], this['frontRight_' + sheetName], this['front_' + sheetName], this['frontLeft_' + sheetName], this['backLeft_' + sheetName], this['back_' + sheetName] ]
        }

        startGame()

    }

    createSheetImages = () => {

        this.images = {}

        for (let sheetName in this.sheetData) {

            for (let row in this.rows) {
                this.images[this.rows[row] + '_' + sheetName] = {
                    image: new Image(),
                    size: this.sheetData[sheetName].size,
                    offset: this.sheetData[sheetName].offset
                }
            }

        }

    }

    loadSheetImages = () => {

        for (let sheetName in this.sheetData) {

            let sheet = new Image()

            sheet.onload = () => {
                this.loadSheet(sheet, sheetName)
            }
            sheet.src = this.sheetData[sheetName].image

        }

    }

    loadSheet = (sheet, sheetName) => {

        let imageDims = {
            width: sheet.width,
            height: sheet.height / 6
        }

        for (let row in this.rows) {

            let tempCanvas = document.createElement('canvas')
            tempCanvas.width = imageDims.width
            tempCanvas.height = imageDims.height
            let tempctx = tempCanvas.getContext('2d')

            tempctx.drawImage(sheet, 0, imageDims.height * row, imageDims.width, imageDims.height, 0, 0, imageDims.width, imageDims.height)

            tempCanvas = this.utils.upscale(tempCanvas)

            let image = tempCanvas.toDataURL('image/png')

            this[this.rows[row] + '_' + sheetName].image.src = image

        }

    }

}