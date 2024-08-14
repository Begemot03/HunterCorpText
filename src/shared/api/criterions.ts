type Row<T> = Array<T>;

type DataTable = {
    headers: Row<string>,
    rows: Array<Row<any>>
};

type NormalizeF = (sampleValue: number, col: number) => number;


const vectorLen = (a: Row<number>): number => {
    let distance = 0;

    for(let i = 0; i < a.length; i++) {
        distance += (Number.isNaN(a[i]) ? 0 : a[i] * a[i]);
    }

    return Math.sqrt(distance);
}

const avgCalc = (table: DataTable): DataTable => {
    const avgTable: DataTable = {
        headers: [...table.headers],
        rows: [Array.from({ length: table.headers.length }, () => 0)]
    };

    for(let i = 0; i < table.rows.length; i++) {
        for(let j = 0; j < table.headers.length; j++) {
            avgTable.rows[0][j] += table.rows[i][j] == null ? 0 : table.rows[i][j];
        }
    }

    for(let j = 0; j < avgTable.rows[0].length; j++) {
        avgTable.rows[0][j] /= table.rows.length;
    }

    return avgTable;
}

const dispersionCalc = (table: DataTable): DataTable => {
    const avgTable = avgCalc(table);

    const dispersionTable: DataTable = {
        headers: [...table.headers],
        rows: [Array.from({ length: table.headers.length }, () => 0)]
    };

    for(let i = 0; i < table.rows.length; i++) {
        for(let j = 0; j < table.headers.length; j++) {
            const value = (table.rows[i][j] == null ? 0 : table.rows[i][j]) - avgTable.rows[0][j];
            dispersionTable.rows[0][j] += (value * value);
        }
    }

    for(let j = 0; j < avgTable.rows[0].length; j++) {
        dispersionTable.rows[0][j] /= table.rows.length;
    }

    return dispersionTable;
}

const maxCalc = (table: DataTable): DataTable => {
    const maxTable: DataTable = {
        headers: [...table.headers],
        rows: [Array.from({ length: table.headers.length }, (v, k) => table.rows[0][k])]
    };

    for(let i = 1; i < table.rows.length; i++) {
        for(let j = 0; j < table.headers.length; j++) {
            if(table.rows[i][j] === null) continue;
            if(table.rows[i][j] > maxTable.rows[0][j]) maxTable.rows[0][j] = table.rows[i][j];
        }
    }

    return maxTable;
}

const avgCriterion = (table: DataTable): NormalizeF => {
    const avgTable = avgCalc(table);

    return (sampleValue: number, col: number): number => {
        return sampleValue < avgTable.rows[0][col] ? 0 : 1;
    };
}

const zCriterion = (table: DataTable): NormalizeF => {
    const avgTable = avgCalc(table);
    const dispersionTable = dispersionCalc(table);

    return (sampleValue: number, col: number) => {
        if(dispersionTable.rows[0][col] === 0) return 0;

        return Math.floor((sampleValue - avgTable.rows[0][col]) / Math.sqrt(dispersionTable.rows[0][col]));
    }
};

const normalizeCriterion = (table: DataTable): NormalizeF => {
    const maxTable = maxCalc(table);

    return (sampleValue: number, col: number) => {
        if(maxTable.rows[0][col] === 0 || sampleValue === null || sampleValue === undefined) return 0;
        return sampleValue / maxTable.rows[0][col];
    }
}

export {
    vectorLen,
    avgCalc,
    dispersionCalc,
    maxCalc,
    avgCriterion, 
    zCriterion,
    normalizeCriterion,
    DataTable, 
    Row,
    NormalizeF
}