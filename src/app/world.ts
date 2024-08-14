import { DataTable } from "../shared/api/criterions";
import { TableNodeDistanceBetween } from "../shared/api/getNeighbors";
import Connection from "./connection";
import Cycle from "./cycle";

type Graph = {
    nodes: DataTable;
    connections: TableNodeDistanceBetween;
};

type World = {
    width: number;
    height: number;
    scale: number; // Масштаб от 0.1 до 1
    offsetX?: number;
    offsetY?: number;
    mouseCoords: { x: number; y: number };
};

const renderWorld = ({ nodes, connections }: Graph) => {
    return (
        ctx: CanvasRenderingContext2D,
        { width, height, scale, offsetX = 0, offsetY = 0, mouseCoords }: World
    ) => {
        
        const sparsity = 5000;
        const effectiveScale = sparsity * scale;
        
        // Очищаем канвас перед рендерингом
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = "black";

        // Вычисляем центр с учетом смещения и масштаба
        const centerX = width / 2 + offsetX;
        const centerY = height / 2 + offsetY;

        // Рендеринг вершин
        nodes.rows.forEach(([normX, normY]) => {
            // Преобразуем нормализованные координаты в координаты на канвасе
            const x = normX * effectiveScale + centerX;
            const y = normY * effectiveScale + centerY;
            const radius = 8 * scale;

            // Проверяем, находится ли вершина в видимой области
            if (x >= 0 && x <= width && y >= 0 && y <= height) {
                // Проверяем, находится ли мышь внутри вершины
                const isHovered =
                    Math.sqrt(Math.pow(mouseCoords.x - x, 2) + Math.pow(mouseCoords.y - y, 2)) <= radius;

                ctx.fillStyle = isHovered ? "blue" : "red";
                Cycle({ ctx, x, y, radius });
            }
        });

        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";

        // Рендеринг соединений
        connections.forEach((neighbors, i) => {
            const [x1Norm, y1Norm] = nodes.rows[i];
            const x = x1Norm * effectiveScale + centerX;
            const y = y1Norm * effectiveScale + centerY;

            if (x >= 0 && x <= width && y >= 0 && y <= height) {
                Connection({ ctx, x, y, connections: neighbors, nodes, effectiveScale, offsetX: centerX, offsetY: centerY });
            }
        });
    };
};

export default renderWorld;

export { Graph, World };
