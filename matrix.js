Array.matrix = function(rows, cols, defaultValue) {
    let arr = [];
    for (let i = 0 ; i < rows ; ++i) {
        let columns = [];
        for (let j = 0 ; j < cols ; ++j) {
            columns[j] = defaultValue;
        }
        arr[i] = columns;
    }
    return arr;
}