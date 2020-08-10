// Globals
var fieldScale = 1;
const CellColorMapping = {
    1: 'steelblue',
    2: 'seagreen',
    3: 'mediumvioletred',
    4: 'purple',
    5: 'maroon',
    6: 'teal',
    7: 'black',
    8: 'white'
}
const Difficulties = {
    custom: {
        // Will be the last configuration played
        rows: 16, 
        columns: 30,
        bombs: 99
    },
    beginner: {
        rows: 9,
        columns: 9,
        bombs: 10
    },
    intermediate: {
        rows: 16,
        columns: 16,
        bombs: 40
    },
    expert: {
        rows: 16,
        columns: 30,
        bombs: 99
    }
}
  
var GameState = {
    cellMatrix: 0,
    numberOfRows: 0,
    numberOfColumns: 0,
    numberOfBombs: 0,
    openCells: 0,
    over: false
} 

// Element definitions
const root = document.documentElement;

const buttonMinus = document.getElementById("button-minus");
const buttonPlus = document.getElementById("button-plus");

const formConfig = document.getElementById("form-config");
const inputTextRows = document.getElementById("inputtext-rows");
const inputTextColumns = document.getElementById("inputtext-columns");
const inputTextBombs = document.getElementById("inputtext-bombs");
const buttonPlay = document.getElementById("button-play");

const divField = document.getElementById("div-field");
const divCustomConfig = document.getElementById("div-custom-config");

// Event binders
window.onload = function() {
    setFieldScale(0.5);
}

divField.addEventListener('contextmenu', function(e) {
    e.preventDefault();
}, true);

buttonMinus.addEventListener('click', function() {
    setFieldScale(fieldScale * 0.9);
});

buttonPlus.addEventListener('click', function() {
    setFieldScale(fieldScale * 1.1);
});

formConfig.addEventListener('submit', function() {
    event.preventDefault();
    buttonPlay.addEventListener("animationend", function () {
        // Removes focus so that the next click animation plays
        buttonPlay.blur();
    }); 
    startGame(inputTextRows.value, inputTextColumns.value, inputTextBombs.value);
});

// Functions
function setFieldScale(newScale) {
    fieldScale = newScale;
    divField.style.setProperty('transform', `scale(${fieldScale})`);
}

function changeDifficulty(radioButton) {
    inputTextRows.value = Difficulties[radioButton.value].rows;
    inputTextColumns.value = Difficulties[radioButton.value].columns;
    inputTextBombs.value = Difficulties[radioButton.value].bombs;
    
    if (radioButton.value == "custom") {
        divCustomConfig.classList.remove('d-none');
        divCustomConfig.classList.add('d-block');
    } else {
        divCustomConfig.classList.remove('d-block');
        divCustomConfig.classList.add('d-none');
    }
}

function getAdjacentCells(i, j) {
    let cells = [];
    try {if (GameState.cellMatrix[i + 0][j + 1] != undefined) cells.push({i: i + 0, j: j + 1});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i + 1][j + 1] != undefined) cells.push({i: i + 1, j: j + 1});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i + 1][j + 0] != undefined) cells.push({i: i + 1, j: j + 0});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i + 1][j - 1] != undefined) cells.push({i: i + 1, j: j - 1});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i + 0][j - 1] != undefined) cells.push({i: i + 0, j: j - 1});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i - 1][j - 1] != undefined) cells.push({i: i - 1, j: j - 1});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i - 1][j + 0] != undefined) cells.push({i: i - 1, j: j + 0});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i - 1][j + 1] != undefined) cells.push({i: i - 1, j: j + 1});} catch (TypeError) {}
    return cells;
}

function openAllCells() {
    for (let i = 0 ; i < GameState.numberOfRows ; i++) {
        for (let j = 0 ; j < GameState.numberOfColumns ; j++) {
            thisCell = getCellByCoordinate(i, j);
            thisCell.classList.remove("fa", "fa-flag");
            const cellType = getCellType(i, j);
            if (cellType == -1) {
                thisCell.classList.add("cell-bomb");;
                thisCell.innerHTML = '<i class="fa fa-bomb"></i>';
            } else {
                thisCell.classList.remove("cell-undiscovered");
                if (cellType != 0) {
                    thisCell.classList.add("cell-number");
                    thisCell.innerText = cellType;
                    thisCell.style.setProperty("color", CellColorMapping[cellType]);
                }
            }
            thisCell.classList.add("opened");
        }
    }
}

function startGame(rows, columns, bombs) {
    GameState.numberOfRows = rows;
    GameState.numberOfColumns = columns;
    GameState.numberOfBombs = bombs;
    GameState.openCells = 0;
    GameState.over = false;
    setPlayField(rows, columns, bombs);
}

function endGame(wonOrLost) {
    if (!GameState.over) {
        openAllCells();
        showModal(wonOrLost + '!');
        GameState.over = true;
    }
}

function getCellType(i, j) {
    if (GameState.cellMatrix[i][j] == -1) return -1;
    let bombCounter = 0;
    for (cell of getAdjacentCells(i, j)) {
        if (GameState.cellMatrix[cell.i][cell.j] == -1)
            bombCounter++;
    }
    return bombCounter;
}

function flagCell(i, j) {
    thisCell = getCellByCoordinate(i, j);
    if (!thisCell.classList.contains('opened')) {
        thisCell.classList.toggle('fa')
        thisCell.classList.toggle('fa-flag');
        thisCell.classList.toggle('cell-flag');
    }
}

function openCell(i, j) {
    thisCell = getCellByCoordinate(i, j);
    thisCell.classList.remove("fa", "fa-flag");
    const cellType = getCellType(i, j);
    if (cellType == -1) {
        thisCell.classList.add("opened", "cell-bomb");;
        thisCell.innerHTML = '<i class="fa fa-bomb"></i>';
        endGame('lost');
    } else if (!thisCell.classList.contains("opened")){
        GameState.openCells++;
        thisCell.classList.remove("cell-undiscovered");
        thisCell.classList.add("opened");
        if (cellType == 0) {
            for (cell of getAdjacentCells(i, j)) {
                openCell(cell.i, cell.j);
            }
        } else if (cellType != 0) {
            thisCell.classList.add("cell-number");
            thisCell.innerText = cellType;
            thisCell.style.setProperty("color", CellColorMapping[cellType]);
        }
    }
    
    if (GameState.openCells == GameState.numberOfRows * GameState.numberOfColumns - GameState.numberOfBombs) {
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
    if (!(rows && columns && bombs)) {
        return;
    }

    GameState.cellMatrix = Array.matrix(rows, columns, 0);

    // Generate bombs
    for (let i = 0 ; i < bombs ; i++) {
        let randomRow = getRandom(rows);
        let randomColumn = getRandom(columns);
        while (GameState.cellMatrix[randomRow][randomColumn] == -1) {
            randomRow = getRandom(rows);
            randomColumn = getRandom(columns);
        }
        GameState.cellMatrix[randomRow][randomColumn] = -1;
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
            cell.addEventListener('mouseup', function(event){
                if (event.button == 0 && !getCellByCoordinate(i, j).classList.contains('fa-flag'))
                    openCell(i, j);
                else if (event.button == 2)
                    flagCell(i, j);
            });
            divRow.appendChild(cell);
        }
        divField.appendChild(divRow);
    }
}