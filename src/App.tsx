import { ChangeEvent } from "react";
import { parse, ParseResult } from "papaparse";
import { avgCriterion, normalizeCriterion, zCriterion } from "./shared/api/getCritarions";
import { transformByCriterion } from "./shared/api/transformByCriterion";
import { tableTyping } from "./shared/api/tableTyping";
import { getDistances, getNeighbors } from "./shared/api/getNeighbors";
import { cosineSimilarity, jaccardCoefficient } from "./shared/api/similarityFunctions";

const showFile = async (input: ChangeEvent<HTMLInputElement>) => {
    let file = input.target.files[0];
    const content = await file.text();

    const table : ParseResult<any> = parse(content);
    const sample = tableTyping(table, 6);
    const norm = normalizeCriterion(sample, 6);
    const normSample = transformByCriterion(sample, norm, 6);

    const distances = getDistances(sample, cosineSimilarity, 6);

    console.log(distances)
};

const App = () => {
    return (
        <>
            <input 
                type="file" 
                onChange={(e) => showFile(e)}
            />
        </>   
    )
}

export { App };