import { DataTable, maxCalc, NormalizeF, Row, vectorLen } from "./criterions"


const transformByCriterion = (
        table: DataTable, 
        criterionFunc: NormalizeF, 
    ): DataTable => {
    const transformedTable: DataTable = {
        headers: [...table.headers],
        rows: [],
    };

    for(let i = 0; i < table.rows.length; i++) {
        const row: Row<number> = [];

        for(let j = 0; j < table.headers.length; j++) {
            const value = criterionFunc(table.rows[i][j], j);
            row.push(value);
        }

        transformedTable.rows.push([...row]);
    }

    return transformedTable;
}

const normalizeTable = (
        table: DataTable,
    ): DataTable => {
    const normalizedTable : DataTable = {
        headers: [...table.headers],
        rows: [],
    }; 
    const maxValues: DataTable = maxCalc(table);

    // Нормализация по столбцам
    for(let i = 0; i < table.rows.length; i++) {
        const row: Row<number> = [];

        for(let j = 0; j < table.headers.length; j++) {
            const value = table.rows[i][j] / maxValues.rows[0][j];
            row.push(maxValues.rows[0][j] == 0 ? 0 : value);
        }

        normalizedTable.rows.push([...row]);
    }

    // Нормализация строк
    for(let i = 0; i < table.rows.length; i++) {
        const len = vectorLen(normalizedTable.rows[i]);

        for(let j = 0; j < table.headers.length; j++) {
            normalizedTable.rows[i][j] /= len;
        }
    }

    return normalizedTable;
}

export {
    transformByCriterion, 
    normalizeTable,
}