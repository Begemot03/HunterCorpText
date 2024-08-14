import { DataTable } from "./criterions";

const slice = (table: DataTable, point: number): { left: DataTable, right: DataTable } => {
    const left: DataTable = {
        headers: [...table.headers.slice(0, point)],
        rows: [],
    };

    const right: DataTable = {
        headers: [...table.headers.slice(point, table.headers.length)],
        rows: [],
    };

    for(let i = 0; i < table.rows.length; i++) {
        left.rows.push(Array.from({ length: point }));
        right.rows.push(Array.from({ length: table.headers.length - point }));
        for(let j = 0; j < table.headers.length; j++) {
            if(j < point) left.rows[i][j] = table.rows[i][j] == null ? 0 : table.rows[i][j];
            else right.rows[i][j - point] = table.rows[i][j] == null ? 0 : table.rows[i][j];
        }
    }

    return {
        left,
        right,
    };
}

export {
    slice,
}