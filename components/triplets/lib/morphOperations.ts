const squareKernel = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    // [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

const plusKernel = [
    [-1, 0],
    [0, -1],
    // [0, 0],
    [0, 1],
    [1, 0],
];

const verticalKernel = [
    [0, -1],
    [0, 1],
];
const horizontalKernel = [
    [-1, 0],
    [1, 0],
];

export type Kernels = "square" | "plus" | "horizontal" | "vertical";

export function erode(grid: number[][], kernel: Kernels = "square") {
    const result: number[][] = [];
    let k = squareKernel;
    if (kernel === "plus") k = plusKernel;
    else if (kernel === "vertical") k = verticalKernel;
    else if (kernel === "horizontal") k = horizontalKernel;

    for (let i = 0; i < grid.length; i++) {
        const row: number[] = [];

        for (let j = 0; j < grid.length; j++) {
            if (grid[i][j]) {
                let allNeighborsOn = true;
                for (const [di, dj] of k) {
                    const newI = i + di;
                    const newJ = j + dj;
                    if (
                        newI >= 0 &&
                        newI < grid.length &&
                        newJ >= 0 &&
                        newJ < grid.length &&
                        grid[newI][newJ] === 0
                    ) {
                        allNeighborsOn = false;
                        break;
                    }
                }
                row.push(allNeighborsOn ? 1 : 0);
            } else row.push(0);
        }
        result.push(row);
    }

    for (let i = 0; i < grid.length; i++) grid[i] = result[i];
}

export function dilate(grid: number[][], kernel: Kernels = "square") {
    const result: number[][] = [];
    let k = squareKernel;
    if (kernel === "plus") k = plusKernel;
    else if (kernel === "vertical") k = verticalKernel;
    else if (kernel === "horizontal") k = horizontalKernel;

    for (let i = 0; i < grid.length; i++) {
        const row: number[] = [];

        for (let j = 0; j < grid.length; j++) {
            if (grid[i][j]) row.push(1);
            else {
                let neighborIsOn = false;
                for (const [di, dj] of k) {
                    const newI = i + di;
                    const newJ = j + dj;
                    if (
                        newI >= 0 &&
                        newI < grid.length &&
                        newJ >= 0 &&
                        newJ < grid.length &&
                        grid[newI][newJ] !== 0
                    ) {
                        neighborIsOn = true;
                        break;
                    }
                }
                row.push(neighborIsOn ? 1 : 0);
            }
        }
        result.push(row);
    }

    for (let i = 0; i < grid.length; i++) grid[i] = result[i];
}
