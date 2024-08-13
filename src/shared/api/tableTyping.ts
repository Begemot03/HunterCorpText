import { ParseResult } from "papaparse";
import { DataTable } from "./getCritarions";

const tableTyping = (table: ParseResult<any>, hStart: number) : DataTable => {
    const result: DataTable = {
        headers: [...table.data[0]],
        rows: [],
    };

    for (let i = 1; i < table.data.length; i++) {
        result.rows.push([]);

        for (let j = 0; j < table.data[i].length; j++) {
            if(j < hStart) {
                result.rows[i - 1].push(table.data[i][j]);
            } else {
                const value = parseFloat(table.data[i][j].replaceAll(",", ""));
                if(!Number.isNaN(value)) result.rows[i - 1].push(value);
                else result.rows[i - 1].push(null);
            }
        }
    }

    return result;
}

export { 
    tableTyping,
}