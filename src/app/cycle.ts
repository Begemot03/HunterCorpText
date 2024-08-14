type CycleConfig = {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    radius: number;
}


const Cycle = ({ ctx, x, y, radius } : CycleConfig) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

export default Cycle;