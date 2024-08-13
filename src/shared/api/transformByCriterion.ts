import { DataTable, NormalizeF } from "./getCritarions"


const transformByCriterion = (
        table: DataTable, 
        criterionFunc: NormalizeF, 
        hStart: number
    ): DataTable => {
    const normalizedTable: DataTable = {
        headers: [...table.headers],
        rows: [],
    };

    for(let i = 0; i < table.rows.length; i++) {
        const row: Array<number> = [];

        for(let j = 0; j < table.headers.length; j++) {
            if(j >= hStart) {
                const value = criterionFunc(table.rows[i][j], j);
                row.push(value);
            } else {
                row.push(table.rows[i][j]);
            }
        }

        normalizedTable.rows.push([...row]);
    }

    return normalizedTable;
}

export {
    transformByCriterion, 
}