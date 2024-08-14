import { DataTable, Row } from "./criterions";
import { SimirarityF } from "./similarityFunctions";

type TableNodeDistanceBetween = Array<Row<number>>;

const getNeighbors = (
        table: DataTable, 
        similarityFunc: SimirarityF,
        threshold: (v: number) => boolean
    ): TableNodeDistanceBetween => {
    const nodeDistances: TableNodeDistanceBetween = Array.from({ length: table.rows.length }, () => []);

    for(let i = 0; i < table.rows.length; i++) {
        for(let j = i + 1; j < table.rows.length; j++) {
            const similarityCoef = similarityFunc(table.rows[i], table.rows[j]);
            if(threshold(similarityCoef)) {
                nodeDistances[i].push(j);
            }
        }
    }

    return nodeDistances;
}

const getDistances = (
        table: DataTable, 
        similarityFunc: SimirarityF
    ): TableNodeDistanceBetween => {
    const nodeDistances: TableNodeDistanceBetween = Array.from({ length: table.rows.length }, () => Array.from({ length: table.rows.length }, () => 0));

    for(let i = 0; i < table.rows.length; i++) {
        for(let j = i + 1; j < table.rows.length; j++) {
            const similarityCoef = similarityFunc(table.rows[i], table.rows[j]);
            nodeDistances[i][j] = similarityCoef;
            nodeDistances[j][i] = similarityCoef;
        }
    }

    return nodeDistances;
}   


export { 
    getNeighbors,
    getDistances,
    TableNodeDistanceBetween,
};