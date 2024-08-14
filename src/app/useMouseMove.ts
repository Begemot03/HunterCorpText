import { useEffect, useState, useCallback } from "react";

const useMouseMove = (): [boolean, { x: number; y: number }] => {
    const [isDown, setIsDown] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });

    const downHandler = useCallback((e: MouseEvent) => {
        setIsDown(true);
        setPrevPosition({ x: e.clientX, y: e.clientY });
    }, []);

    const upHandler = useCallback(() => {
        setIsDown(false);
    }, []);

    const moveHandler = useCallback(
        (e: MouseEvent) => {
            if (!isDown) return;

            const newOffset = {
                x: e.clientX - prevPosition.x,
                y: e.clientY - prevPosition.y,
            };

            setOffset(newOffset);
            setPrevPosition({ x: e.clientX, y: e.clientY });
        },
        [isDown, prevPosition]
    );

    useEffect(() => {
        window.addEventListener("mousedown", downHandler);
        window.addEventListener("mouseup", upHandler);
        window.addEventListener("mousemove", moveHandler);

        return () => {
            window.removeEventListener("mousedown", downHandler);
            window.removeEventListener("mouseup", upHandler);
            window.removeEventListener("mousemove", moveHandler);
        };
    }, [downHandler, upHandler, moveHandler]);

    return [isDown, offset];
};

export default useMouseMove;
