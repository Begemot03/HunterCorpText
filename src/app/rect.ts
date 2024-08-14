type RectConfig = {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    width: number;
    height: number
}


const Rect = ({ ctx, x, y, width, height } : RectConfig) => {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.stroke();
}

export default Rect;