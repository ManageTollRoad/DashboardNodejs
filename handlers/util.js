function calcMatrixAcc(matrix) {
    let positive = 0;
    let all = 0;
    if (matrix) {
        matrix.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (rowIndex !== 0 && cellIndex !== 0) {
                    if (rowIndex === cellIndex) positive++;
                    all++;
                }
            });
        });
    }
    if (all === 0) return 0;
    return positive / all;
}

module.exports = {
    calcMatrixAcc
}