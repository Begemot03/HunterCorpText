import { useRef } from "react";

const useBouncing = (cb: (...args: any[]) => any, ms: number) => {
    let wait = useRef(false);

    return (...args: any[]) => {
        if (wait.current) return;

        wait.current = true;

        cb.apply(null, args);

        setTimeout(() => {
            wait.current = false;
        }, ms);
    }
}

export default useBouncing;