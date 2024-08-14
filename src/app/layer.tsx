import { useCallback, useEffect, useRef, useState } from "react";
import useBouncing from "../shared/api/bouncing";
import useMouseMove from "./useMouseMove";
import { World } from "./world";
import useMousePosition from "./useMousePosition";

type CameraConfig = {
    width: number;
    height: number;
    render: (ctx: CanvasRenderingContext2D, world: World) => void;
};

const clamp = (min, max, v) => {
    return Math.min(max, Math.max(min, v));
}

const Layer = ({ width, height, render }: CameraConfig) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [scale, setScale] = useState(0.5);
    const [isDown, offset] = useMouseMove();
    const [ mouseCoords, mousePosHandler ] = useMousePosition();
    const [localOffset, setLocalOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
            render(ctx, {
                width,
                height,
                scale,
                offsetX: localOffset.x,
                offsetY: localOffset.y,
                mouseCoords, // Передаем позицию мыши в функцию рендеринга
            });
        }
    }, [scale, localOffset, render, width, height, mouseCoords]);

    const scrollHandler = useCallback((e: WheelEvent) => {
        if (e.deltaY !== 0) {
            setScale(prevScale => clamp(0.1, 1, prevScale + (e.deltaY > 0 ? -0.1 : 0.1)));
        }
    }, [clamp]);
    
    const mouseMoveHandler = useCallback(() => {
        if (isDown) {
            setLocalOffset(prevOffset => ({
                x: prevOffset.x + offset.x,
                y: prevOffset.y + offset.y,
            }));
        }
    }, [isDown, offset]);

    const b = useBouncing(scrollHandler, 1000 / 60);
    const bm = useBouncing(mouseMoveHandler, 1000 / 60);

    useEffect(() => {
        window.addEventListener("wheel", scrollHandler);
        window.addEventListener("mousemove", mouseMoveHandler);

        return () => {
            window.removeEventListener("wheel", scrollHandler);
            window.removeEventListener("mousemove", mouseMoveHandler);
        };
    }, [b, bm]);

    return <canvas ref={canvasRef} width={width} height={height} />;
};

export { Layer };
