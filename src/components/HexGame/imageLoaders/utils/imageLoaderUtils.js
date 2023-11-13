
import { SCALE_SIZE } from "../imageLoaderConstants"

export default class ImageLoaderUtilsClass {

    upscale = (canvas) => {

        let scaleSize = SCALE_SIZE

        let newCanvas = document.createElement('canvas')
        newCanvas.width = canvas.width * scaleSize
        newCanvas.height = canvas.height * scaleSize
        let newctx = newCanvas.getContext('2d')
        let imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data
        

        for(let i=0; i<imageData.length; i+=4) {

            let red = imageData[i]
            let green = imageData[i+1]
            let blue = imageData[i+2]
            let alpha = imageData[i+3]

            let pixelIndex = i/4
            let row = Math.floor(pixelIndex/canvas.width)
            let col = pixelIndex%canvas.width

            newctx.fillStyle = `rgba(${red},${green},${blue},${alpha/256})`
            newctx.fillRect(col*scaleSize, row*scaleSize, scaleSize, scaleSize)

        }

        return newCanvas

    }

    loadImages = (startGame, loaders) => {

        let totalLoaded = 0
        let testLoaded = () => {
            totalLoaded++
            if (totalLoaded === loaders.length) startGame()
        }

        for (let loader of loaders) {
            if(loader.loaders) loader.loadImages(testLoaded, loader.loaders)
            else loader.loadImages(testLoaded)
        }

    }

}