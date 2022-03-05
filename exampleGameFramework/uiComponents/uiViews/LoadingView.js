export default class LoadingViewClass {

    constructor(ctx){
        this.ctx = ctx;
    }

    drawLoading = () => {
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "black"
        let text = "Loading..."
        this.ctx.fillText(text, 10 + this.ctx.measureText(text).width/2, 50);
     }

}