// Globals
var cellSize = 50;

// Game state    
const cellMatrix = [];
let openCells = 0;
let numberOfRows = 0;
let numberOfColumns = 0;
let numberOfBombs = 0;

const ColorMapping = {
    1: 'steelblue',
    2: 'seagreen',
    3: 'mediumvioletred',
    4: 'purple',
    5: 'maroon',
    6: 'teal',
    7: 'black',
    8: 'white'
}

// Element definitions
const root = document.documentElement;

const buttonMinus = document.getElementById("button-minus");
const buttonPlus = document.getElementById("button-plus");

const formConfig = document.getElementById("form-config");
const inputTextRows = document.getElementById("inputtext-rows");
const inputTextColumns = document.getElementById("inputtext-columns");
const inputTextBombs = document.getElementById("inputtext-bombs");

const divField = document.getElementById("div-field");

// Event binders
window.onload = function() {
    root.style.setProperty('--cell-size', `${cellSize}px`);
}

divField.addEventListener('contextmenu', function(e) {
    e.preventDefault();
}, true);   

buttonMinus.addEventListener('click', function() {
    cellSize = (cellSize <= 30) ? cellSize : cellSize -= 5;
    root.style.setProperty('--cell-size', `${cellSize}px`);
});

buttonPlus.addEventListener('click', function() {
    cellSize = (cellSize >= 100) ? cellSize : cellSize += 5;
    root.style.setProperty('--cell-size', `${cellSize}px`);
});

formConfig.addEventListener('submit', function() {
    event.preventDefault();
    startGame(inputTextRows.value, inputTextColumns.value, inputTextBombs.value);
});

// Functions
function getAdjacentCells(i, j) {
    let cells = [];
    try {if (cellMatrix[i + 0][j + 1] != undefined) cells.push({i: i + 0, j: j + 1});} catch (TypeError) {}
    try {if (cellMatrix[i + 1][j + 1] != undefined) cells.push({i: i + 1, j: j + 1});} catch (TypeError) {}
    try {if (cellMatrix[i + 1][j + 0] != undefined) cells.push({i: i + 1, j: j + 0});} catch (TypeError) {}
    try {if (cellMatrix[i + 1][j - 1] != undefined) cells.push({i: i + 1, j: j - 1});} catch (TypeError) {}
    try {if (cellMatrix[i + 0][j - 1] != undefined) cells.push({i: i + 0, j: j - 1});} catch (TypeError) {}
    try {if (cellMatrix[i - 1][j - 1] != undefined) cells.push({i: i - 1, j: j - 1});} catch (TypeError) {}
    try {if (cellMatrix[i - 1][j + 0] != undefined) cells.push({i: i - 1, j: j + 0});} catch (TypeError) {}
    try {if (cellMatrix[i - 1][j + 1] != undefined) cells.push({i: i - 1, j: j + 1});} catch (TypeError) {}
    return cells;
}

function openAllCells() {
    for (let i = 0 ; i < numberOfRows ; i++) {
        for (let j = 0 ; j < numberOfColumns ; j++) {
            thisCell = getCellByCoordinate(i, j);
            thisCell.classList.remove("fa", "fa-flag");
            const cellType = getCellType(i, j);
            thisCell.disabled = true;
            if (cellType == -1) {
                thisCell.style.setProperty("font-size", "1.5rem");
                thisCell.innerHTML = '<i class="fa fa-bomb"></i>';
            } else {
                thisCell.disabled = true;
                thisCell.classList.remove("cell-undiscovered");
                if (cellType != 0) {
                    thisCell.style.setProperty('font-family', `'Nova Round', cursive`);
                    thisCell.innerText = cellType;
                    thisCell.style.setProperty("color", ColorMapping[cellType]);
                }
            }
        }
    }
}

function startGame(rows, columns, bombs) {
    numberOfRows = rows;
    numberOfColumns = columns;
    numberOfBombs = bombs;
    openCells = 0;
    setPlayField(rows, columns, bombs);
}

function endGame(wonOrLost) {
    openAllCells();
    alert(wonOrLost + '!');
}

function getCellType(i, j) {
    if (cellMatrix[i][j] == -1) return -1;
    let bombCounter = 0;
    for (cell of getAdjacentCells(i, j)) {
        if (cellMatrix[cell.i][cell.j] == -1)
            bombCounter++;
    }
    return bombCounter;
}

function flagCell(i, j) {
    thisCell = getCellByCoordinate(i, j);
    if (!thisCell.classList.contains('opened')) {
        thisCell.classList.toggle("fa")
        thisCell.classList.toggle("fa-flag");
    }
}

function openCell(i, j) {
    thisCell = getCellByCoordinate(i, j);
    thisCell.classList.remove("fa", "fa-flag");
    const cellType = getCellType(i, j);
    if (cellType == -1) {
        thisCell.style.setProperty("font-size", "1.5rem");
        thisCell.innerHTML = '<i class="fa fa-bomb"></i>';
        endGame('lost');
    } else if (!thisCell.classList.contains("opened")){
        thisCell.classList.add("opened");
        openCells++;
        thisCell.classList.remove("cell-undiscovered");
        if (cellType == 0) {
            for (cell of getAdjacentCells(i, j)) {
                openCell(cell.i, cell.j);
            }
        } else if (cellType != 0) {
            thisCell.style.setProperty('font-family', `'Nova Round', cursive`);
            thisCell.innerText = cellType;
            thisCell.style.setProperty("color", ColorMapping[cellType]);
        }
    }
    
    if (openCells == numberOfRows * numberOfColumns - numberOfBombs) {
        endGame('won');
    }
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

function getCellByCoordinate(i ,j) {
    return document.getElementById(`cell-${i}-${j}`);
}

function setPlayField(rows, columns, bombs) {
    if (!(rows && columns))
        return;

    // Creates clear field
    for (let i = 0 ; i < rows ; i++) {
        cellMatrix[i] = [];
        for (let j = 0 ; j < columns ; j++) {
            cellMatrix[i][j] = 0;
        }
    }

    // Generate bombs
    for (let i = 0 ; i < bombs ; i++) {
        let randomRow = getRandom(rows);
        let randomColumn = getRandom(columns);
        while (cellMatrix[randomRow][randomColumn] == -1) {
            randomRow = getRandom(rows);
            randomColumn = getRandom(columns);
        }
        cellMatrix[randomRow][randomColumn] = -1;
    }

    // Renders field
    divField.innerHTML = '';
    for (let i = 0 ; i < rows ; i++) {
        let divRow = document.createElement('div');
        divRow.classList.add('d-flex')
        for (let j = 0 ; j < columns ; j++) {
            let cell = document.createElement('span');
            cell.id = `cell-${i}-${j}`;
            cell.classList.add('cell', 'cell-undiscovered');
            cell.oncontextmenu = function(event) {
                event.preventDefault();
                return false;
            };
            cell.addEventListener('mouseup', function(event){
                if (event.button == 0 && !getCellByCoordinate(i ,j).classList.contains('fa-flag'))
                    openCell(i, j);
                if (event.button == 2)
                    flagCell(i, j);
            });
            divRow.appendChild(cell);
        }
        divField.appendChild(divRow);
    }
}