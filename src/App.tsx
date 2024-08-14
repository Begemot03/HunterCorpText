import { ChangeEvent, useEffect, useRef, useState } from "react";
import { parse, ParseResult } from "papaparse";
import { avgCriterion, DataTable, zCriterion } from "./shared/api/criterions";
import { normalizeTable, transformByCriterion } from "./shared/api/transform";
import { tableTyping } from "./shared/api/tableTyping";
import { getNeighbors, TableNodeDistanceBetween } from "./shared/api/getNeighbors";
import { cosineSimilarity, euclideanDistance, jaccardCoefficient, manhattanDistance } from "./shared/api/similarityFunctions";
import { pca } from "./shared/api/pca";
import { slice } from "./shared/api/sliceTable";
import { Layer } from "./app/layer";
import renderWorld from "./app/world";

const getNodes = async (input: ChangeEvent<HTMLInputElement>): Promise<[TableNodeDistanceBetween, DataTable, DataTable]> => {
    let file = input.target.files[0];
    const content = await file.text();

    const table : ParseResult<any> = parse(content);
    const sample = tableTyping(table, 6);
    const { left, right } = slice(sample, 6);
    const normSample = normalizeTable(right);
    const pcaTable = pca(normSample, 2);

    const neighbours = getNeighbors(pcaTable, cosineSimilarity, (v) => v > 0.999999999);
    return [ neighbours, pcaTable, left ];
};

const App = () => {
    const [data, setData] = useState<[TableNodeDistanceBetween, DataTable, DataTable]>(null);
    const [loading, setLoading] = useState<boolean>(true);
   

    const handleInput = async (e: ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        const [ neighbours, pcaTable, left ] = await getNodes(e);
        setData([ neighbours, pcaTable, left ]);
        setLoading(false);
    };
    
    return (
        <>
            {
                loading ?  
                <input 
                    type="file" 
                    onChange={handleInput}
                /> : 
                <Layer 
                    width={window.innerWidth}
                    height={window.innerHeight}
                    render={renderWorld({ nodes: data[1], connections: data[0] })}
                />
            }
           
        </>   
    )
}

export { App };