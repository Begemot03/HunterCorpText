import { Row } from "./getCritarions";

type SimirarityF = (a: Row<number>, b: Row<number>, hStart: number) => number ;

const jaccardCoefficient = (a: Row<number>, b: Row<number>, hStart: number = 0): number => {
    let res = 0;

    for(let i = hStart; i < a.length; i++) {
        if(a[i] === b[i]) res++;
    }

    return res / (a.length - hStart);
}

const cosineSimilarity = (a: Row<number>, b: Row<number>, hStart: number = 0): number => {
    let scalar = 0;
    let alen = 0;
    let blen = 0;

    for(let i = hStart; i < a.length; i++) {
        scalar += (a[i] * b[i]);
        alen += (a[i] * a[i]);
        blen += (b[i] * b[i]);
    }

    alen = Math.sqrt(alen); blen = Math.sqrt(blen);

    return scalar / (alen * blen);
}

export {
    jaccardCoefficient,
    cosineSimilarity,
    SimirarityF,
};