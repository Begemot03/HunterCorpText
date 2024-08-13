import { DataTable, Row } from "./getCritarions";
import { SimirarityF } from "./similarityFunctions";

type TableNodeDistanceBetween = Array<Row<number>>;

const getNeighbors = (
        table: DataTable, 
        similarityFunc: SimirarityF,
        threshold: number,
        hStart: number
    ): TableNodeDistanceBetween => {
    const nodeDistances: TableNodeDistanceBetween = Array.from({ length: table.rows.length }, () => []);

    for(let i = 0; i < table.rows.length; i++) {
        for(let j = i + 1; j < table.rows.length; j++) {
            const similarityCoef = similarityFunc(table.rows[i], table.rows[j], hStart);
            if(similarityCoef >= threshold) {
                nodeDistances[i].push(j);
                nodeDistances[j].push(i);
            }
        }
    }

    return nodeDistances;
}

const getDistances = (
        table: DataTable, 
        similarityFunc: SimirarityF,
        hStart: number
    ): TableNodeDistanceBetween => {
    const nodeDistances: TableNodeDistanceBetween = Array.from({ length: table.rows.length }, () => []);

    for(let i = 0; i < table.rows.length; i++) {
        for(let j = i + 1; j < table.rows.length; j++) {
            const similarityCoef = similarityFunc(table.rows[i], table.rows[j], hStart);
            nodeDistances[i].push(similarityCoef);
            nodeDistances[j].push(similarityCoef);
        }
    }

    return nodeDistances;
}


export { 
    getNeighbors,
    getDistances,
    TableNodeDistanceBetween,
};