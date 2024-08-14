import { useEffect, useState } from "react";

const useMousePosition = (global: boolean = false): [{ x: number; y: number }, (e: MouseEvent) => void] => {
    const [mouseCoords, setMouseCoords] = useState<{
        x: number;
        y: number
    }>({ x: 0, y: 0 });

    const handleCursorMovement = (e: MouseEvent): void => {
        //@ts-ignore
        let rect = e.target.getBoundingClientRect();

        setMouseCoords({
            x: e.clientX - rect.x,
            y: e.clientY - rect.y,
        });
    };

    useEffect(() => {
        if(global) window.addEventListener("mousemove", handleCursorMovement);

        return () => {
            if(global) window.removeEventListener("mousemove", handleCursorMovement);
        };
    }, [global]);

    return [mouseCoords, handleCursorMovement];
}

export default useMousePosition;