import { Row } from "./criterions";

type SimirarityF = (a: Row<number>, b: Row<number>) => number;

const jaccardCoefficient = (a: Row<number>, b: Row<number>): number => {
    let res = 0;

    for(let i = 0; i < a.length; i++) {
        if(a[i] === b[i]) res++;
    }

    return res / a.length;
}

const cosineSimilarity = (a: Row<number>, b: Row<number>): number => {
    let scalar = 0;
    let alen = 0;
    let blen = 0;

    for(let i = 0; i < a.length; i++) {
        scalar += (a[i] * b[i]);
        alen += (a[i] * a[i]);
        blen += (b[i] * b[i]);
    }

    alen = Math.sqrt(alen); blen = Math.sqrt(blen);

    return scalar / (alen * blen);
}

const euclideanDistance = (a: Row<number>, b: Row<number>): number => {
    let distance = 0;

    for(let i = 0; i < a.length; i++) {
        distance += ((a[i] - b[i]) * (a[i] - b[i]));
    }

    return Math.sqrt(distance);
}

const manhattanDistance = (a: Row<number>, b: Row<number>): number => {
    let distance = 0;

    for(let i = 0; i < a.length; i++) {
        distance += Math.abs(a[i] - b[i]);
    }

    return Math.sqrt(distance);
}

export {
    jaccardCoefficient,
    cosineSimilarity,
    euclideanDistance,
    manhattanDistance,
    SimirarityF,
};