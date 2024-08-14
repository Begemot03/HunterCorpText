import { DataTable, Row } from "../shared/api/criterions";

type ConnectionConfig = {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    connections: Row<number>;
    nodes: DataTable;
    effectiveScale: number;
    offsetX?: number;
    offsetY?: number;
};

const Connection = ({ ctx, x, y, connections, nodes, effectiveScale, offsetX = 0, offsetY = 0 }: ConnectionConfig) => {
    ctx.beginPath();
    
    connections.forEach(connectionIndex => {
        const [targetNormX, targetNormY] = nodes.rows[connectionIndex];
        const targetX = targetNormX * effectiveScale + offsetX;
        const targetY = targetNormY * effectiveScale + offsetY;

        if(targetX !== x || targetY !== y) {
            ctx.moveTo(x, y);
            ctx.lineTo(targetX, targetY);
        }
    });

    ctx.stroke();
};

export default Connection;
