import { BigNumber, eigs, MathCollection } from "mathjs";
import { avgCalc, DataTable, Row } from "./criterions";

// Функция для вычитания среднего значения из данных
const centerData = (table: DataTable): DataTable => {
    const result: DataTable = {
        headers: [...table.headers],
        rows: [],
    };

    const avg = avgCalc(table);

    for (let i = 0; i < table.rows.length; i++) {
        result.rows.push(
            table.rows[i].map((val, j) => {
                if (val === null || avg.rows[0][j] === null) return val;
                return (val as number) - (avg.rows[0][j] as number);
            })
        );
    }

    return result;
};

// Функция для вычисления ковариационной матрицы
const covarianceMatrix = (table: DataTable): DataTable => {
    const n = table.rows.length;
    const d = table.headers.length;
    const covMatrix: Array<Row<number>> = Array(d).fill(0).map(() => Array(d).fill(0));

    for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
            let sum = 0;
            let count = 0;
            for (let k = 0; k < n; k++) {
                const xi = table.rows[k][i];
                const xj = table.rows[k][j];
                if (xi !== null && xj !== null) {
                    sum += (xi as number) * (xj as number);
                    count++;
                }
            }
            covMatrix[i][j] = count > 0 ? sum / (count - 1) : 0;
        }
    }

    return {
        headers: [...table.headers],
        rows: covMatrix,
    };
};

type Eigenvector = {
    value: number | BigNumber;
    vector: MathCollection;
};

type Eigenvectors = Eigenvector[];

// Функция для вычисления собственных значений и собственных векторов
const eigen = (covMatrix: DataTable): { eigenvalues: MathCollection, eigenvectors: Eigenvectors } => {
    const eig = eigs(covMatrix.rows as number[][]);
    return {
        eigenvalues: eig.values,
        eigenvectors: eig.eigenvectors.map((vec, i): Eigenvector => ({ value: eig.values[i], vector: vec.vector })),
    };
};

// Функция для сортировки собственных векторов по убыванию собственных значений
function sortEigenvectors(eigenvalues: MathCollection, eigenvectors: Eigenvectors) {
    const eigenPairs = eigenvalues.map((val, i) => [val, eigenvectors[i]]);

    (eigenPairs as any[][]).sort((a: [number | BigNumber, Eigenvector], b: [number | BigNumber, Eigenvector]) => 
        (b[0] as number) - (a[0] as number)
    );

    return {
        sortedEigenvalues: eigenPairs.map(pair => pair[0]),
        sortedEigenvectors: eigenPairs.map(pair => pair[1])
    };
}

// Функция для проекции данных на выбранное количество компонент
function projectData(table: DataTable, eigenvectors: Eigenvectors, numComponents: number): DataTable {
    const projectionMatrix = eigenvectors.slice(0, numComponents).map(eigVec => eigVec.vector);
    const result: DataTable = {
        headers: Array.from({ length: numComponents }, (_, i) => i).map(v => `X${v}`),
        rows: [],
    };

    for (let i = 0; i < table.rows.length; i++) {
        const projectedRow: number[] = projectionMatrix.map(vec =>
            (vec as number[]).reduce((sum, v, j) => sum + (table.rows[i][j] !== null ? v * (table.rows[i][j] as number) : 0), 0)
        );
        result.rows.push(projectedRow);
    }

    return result;
}

function pca(data: DataTable, numComponents = 2): DataTable {
    const centeredData = centerData(data);
    const covMatrix = covarianceMatrix(centeredData);
    const { eigenvalues, eigenvectors } = eigen(covMatrix);
    const { sortedEigenvectors } = sortEigenvectors(eigenvalues, eigenvectors);
    const projectedData = projectData(centeredData, sortedEigenvectors as Eigenvectors, numComponents);
    return projectedData;
}

export {
    pca,
}