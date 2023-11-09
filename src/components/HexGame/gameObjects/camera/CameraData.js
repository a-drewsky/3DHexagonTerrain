
import CollisionClass from "../../utilities/collision"

import { MAX_ZOOM, ZOOM_AMOUNT, INIT_CAMERA_ROTATION, CLICK_MOVE_DIST } from './CameraConstants'

export default class CameraDataClass {

    constructor(mapData) {

        this.mapData = mapData
        this.drawCanvas = null

        this.position = {
            x: 0,
            y: 0
        }

        this.rotation = 0
        this.zoom = 0
        this.anchorPoint = null
        this.mouseAnchorPoint = null
        this.clickPos = null
        this.clickMovePos = null

        this.clickDist = CLICK_MOVE_DIST
        this.maxZoom = MAX_ZOOM
        this.zoomAmount = ZOOM_AMOUNT
        this.initCameraRotation = INIT_CAMERA_ROTATION

        this.collision = new CollisionClass()

    }

    onScreenCheck = (spritePos, spriteSize) => {

        let zoom = this.zoomAmount * this.zoom
        let position = this.position

        //check if sprite is on screen
        if (spritePos.x < position.x - spriteSize.width) return false
        if (spritePos.y < position.y - spriteSize.height) return false
        if (spritePos.x > position.x + this.mapData.canvas.width + zoom) return false
        if (spritePos.y > position.y + this.mapData.canvas.height + zoom * (this.mapData.canvas.height / this.mapData.canvas.width)) return false

        return true
    }

    clickDistPassed = () => {
        return (this.clickPos !== null && this.collision.vectorDist(this.clickPos, this.clickMovePos) > this.clickDist)
    }

    zoomAtMax = () => {
        return this.zoom >= this.maxZoom
    }

    zoomAtMin = () => {
        return this.zoom <= 0
    }

    setPosition = (x, y) => {
        this.position = {
            x: x,
            y: y
        }
    }

    adjustZoomPosition = (deltaY) => {
        this.setPosition(
            this.position.x - this.zoomAmount * deltaY / 200,
            this.position.y - this.zoomAmount * deltaY / 200 * (this.mapData.canvas.height / this.mapData.canvas.width)
        )
    }

    setClickPos = (x, y) => {
        this.clickPos = { x: x, y: y }
        this.clickMovePos = { x: x, y: y }
    }

    setClickMovePos = (x, y) => {
        this.clickMovePos = { x: x, y: y }
    }

    rotateRight = () => {
        this.clearAnchorPoint()
        this.rotation++
        if (this.rotation >= 6) this.rotation -= 6
    }

    rotateLeft = () => {
        this.clearAnchorPoint()
        this.rotation--
        if (this.rotation < 0) this.rotation += 6
    }

    zoomIn = (deltaY) => {
        this.zoom += deltaY / 100
        this.adjustZoomPosition(deltaY)
    }

    setAnchorPoint = () => {
        this.anchorPoint = {
            x: this.position.x,
            y: this.position.y
        }

        this.mouseAnchorPoint = {
            x: this.clickMovePos.x,
            y: this.clickMovePos.y
        }

        this.clickPos = null
        this.clickMovePos = null
    }

    clearAnchorPoint = () => {
        this.anchorPoint = null
        this.mouseAnchorPoint = null
    }

    checkEdges = () => {
        let zoom = this.zoom * this.zoomAmount
        if (this.position.x + zoom / 2 < 0 - this.mapData.canvas.width / 2) this.position.x = 0 - this.mapData.canvas.width / 2 - zoom / 2
        if (this.position.x + zoom / 2 > this.drawCanvas.width - this.mapData.canvas.width / 2) this.position.x = this.drawCanvas.width - this.mapData.canvas.width / 2 - zoom / 2
        if (this.position.y + zoom / 2 * this.mapData.squish < 0 - this.mapData.canvas.height / 2) this.position.y = 0 - this.mapData.canvas.height / 2 - zoom / 2 * this.mapData.squish
        if (this.position.y + zoom / 2 * this.mapData.squish > this.drawCanvas.height - this.mapData.canvas.height / 2) this.position.y = this.drawCanvas.height - this.mapData.canvas.height / 2 - zoom / 2 * this.mapData.squish
    }

}