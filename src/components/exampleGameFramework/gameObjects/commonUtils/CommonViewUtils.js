// export default class CommonViewUtilsClass {

//     constructor(camera){
//         this.camera = camera
//     }

//     onScreenCheck = (spritePos, spriteSize, canvas) => {

//         let zoom = this.camera.zoomAmount * this.camera.zoom

//         let position = this.camera.position

//         //check if sprite is on screen
//         if (spritePos.x < position.x - spriteSize.width
//             || spritePos.y < position.y - spriteSize.height
//             || spritePos.x > position.x + canvas.width + zoom
//             || spritePos.y > position.y + canvas.height + zoom * (canvas.height / canvas.width)) return false;

//         return true
//     }

// }