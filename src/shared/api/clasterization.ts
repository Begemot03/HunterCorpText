import { Row } from "./getCritarions";

type Claster = number;

/*




*/

const vectorDistance = (a: Row<number>, b: Row<number>, hStart: number): number => {
    let distance = 0;

    for(let i = 0; i < a.length; i++) {
        distance += ((a[i] - b[i]) * (a[i] - b[i]));
    }

    return Math.sqrt(distance);
}

const kmean = (normSample: Array<Row<number>>, hStart: number): Claster => {
}