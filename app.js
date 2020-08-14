// Enums
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

const CellTypes = {
    bomb: -1,
    space: 0
}

const MouseButtons = {
    left: 0,
    middle: 1,
    right: 2
}

// Globals
var fieldScale = 1;
var GameState = {
    cellMatrix: 0,
    numberOfRows: 0,
    numberOfColumns: 0,
    numberOfBombs: 0,
    openCells: 0,
    timeStarted: 0,
    timeEnded: 0,
    flagCounter: 0,
    over: false
}

// Element definitions
const inputTextRows = document.getElementById("inputnumber-rows");
const inputTextColumns = document.getElementById("inputnumber-columns");
const inputTextBombs = document.getElementById("inputnumber-bombs");
const divCustomConfig = document.getElementById("div-custom-config");
const divFullscreen = document.getElementById("div-fullscreen");
const divField = document.getElementById("div-field");
const modalEndgame = document.getElementById("modal-custom");
const buttonModalEndgame = document.getElementById("button-modal-custom");

window.onload = function() {
    // Applies bouncy movement to all .bouncing classes
    for (element of document.querySelectorAll('.bouncing')) {
        bounce(element, 1, 0.2);
    }
    
    // Event binders
    divField.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    }, true);

    divField.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    document.getElementById("form-config").addEventListener('submit', function() {
        event.preventDefault();
        resetAnimation(document.getElementById("button-play"));
        startGame(inputTextRows.value, inputTextColumns.value, inputTextBombs.value);
    });

    document.getElementById("button-restart").addEventListener('click', function() {
        event.stopPropagation();
        startGame(inputTextRows.value, inputTextColumns.value, inputTextBombs.value);
    });

    document.getElementById('div-overlay').addEventListener('click', function() {
        hideElement(divFullscreen);
    });
    
    document.getElementById('overlay-button-container').addEventListener('click', function() {
        event.stopPropagation();
    });

    document.getElementById("button-close-game").addEventListener('click', function(event) {
        resetAnimation(this);
        hideElement(divFullscreen);
    });

    document.getElementById("button-zoom-in").addEventListener('click', function(event) {
        resetAnimation(this);
        setFieldScale(fieldScale * 1.1);
    });

    document.getElementById("button-zoom-out").addEventListener('click', function(event) {
        resetAnimation(this);
        setFieldScale(fieldScale * 0.9);
    });

    document.getElementById("button-settings").addEventListener('click', function(event) {
        resetAnimation(this);
        showModal
    });

    buttonModalEndgame.addEventListener('click', function(event) {
        resetAnimation(this);
        hideElement(modalEndgame);
    })
}

// Functions
function setFieldScale(newScale) {
    fieldScale = newScale;
    divField.style.setProperty('transform', `scale(${fieldScale})`);
}

function changeDifficulty(radioButton) {
    inputTextRows.value = Difficulties[radioButton.value].rows;
    inputTextColumns.value = Difficulties[radioButton.value].columns;
    inputTextBombs.value = Difficulties[radioButton.value].bombs;
    
    if (radioButton.value == "custom")
        showElement(divCustomConfig);
    else
        hideElement(divCustomConfig);
}

function getAdjacentCells(i, j) {
    let cells = [];
    try {if (GameState.cellMatrix[i - 1][j - 1] != undefined) cells.push({i: i - 1, j: j - 1});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i - 1][j + 0] != undefined) cells.push({i: i - 1, j: j + 0});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i - 1][j + 1] != undefined) cells.push({i: i - 1, j: j + 1});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i + 0][j - 1] != undefined) cells.push({i: i + 0, j: j - 1});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i + 0][j + 0] != undefined) cells.push({i: i + 0, j: j + 0});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i + 0][j + 1] != undefined) cells.push({i: i + 0, j: j + 1});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i + 1][j - 1] != undefined) cells.push({i: i + 1, j: j - 1});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i + 1][j + 0] != undefined) cells.push({i: i + 1, j: j + 0});} catch (TypeError) {}
    try {if (GameState.cellMatrix[i + 1][j + 1] != undefined) cells.push({i: i + 1, j: j + 1});} catch (TypeError) {}
    return cells;
}

function openAllCells() {
    for (let i = 0 ; i < GameState.numberOfRows ; i++) {
        for (let j = 0 ; j < GameState.numberOfColumns ; j++) {
            let thisCell = getCellByCoordinate(i, j);
            thisCell.classList.remove("fa", "fa-flag", "cell-flag");
            const cellType = getCellType(i, j);
            if (cellType == CellTypes.bomb) {
                thisCell.classList.add("cell-bomb");;
                thisCell.innerHTML = '<i class="fa fa-bomb"></i>';
            } else {
                thisCell.classList.remove("cell-undiscovered");
                if (cellType != CellTypes.space) {
                    thisCell.classList.add("cell-number");
                    thisCell.textContent = cellType;
                    thisCell.style.setProperty("color", CellColorMapping[cellType]);
                }
            }
            thisCell.classList.add("opened");
        }
    }
}

function showModal(title, message, buttonText) {
    document.getElementById("modal-custom-title").innerHTML = title;
    document.getElementById("modal-custom-body").innerHTML = message;
    buttonModalEndgame.innerHTML = buttonText;
    showElement(modalEndgame, 'flex');
}

function showEndgameModal(isGameWon) {
    let title = (isGameWon) ? "Congratulations! &#x1f973;<br/>You Won The Game!" : "You lost it fam... &#x1f614;";
    let message = `
        Time elapsed: <span class="pull-right">${GameState.timeEnded - GameState.timeStarted}</span><br/>
        Flags put: <span class="pull-right">${GameState.flagCounter}</span>
    `;
    let buttonText = (isGameWon) ? "Smash it again &#x1f60e;" : "I'll try again I can do it &#x1f624;";
    showModal(title, message, buttonText);
}

function startGame(rows, columns, bombs) {
    GameState.numberOfRows = rows;
    GameState.numberOfColumns = columns;
    GameState.numberOfBombs = bombs;
    GameState.openCells = 0;
    GameState.over = false;
    GameState.timeStarted = Date.now();
    showElement(divFullscreen, 'flex');
    setPlayField(rows, columns, bombs);
}

function endGame(isGameWon) {
    GameState.timeEnded = Date.now();
    if (!GameState.over) {
        openAllCells();
        showEndgameModal(isGameWon);
        GameState.over = true;
    }
}

function getCellType(i, j) {
    if (GameState.cellMatrix[i][j] == CellTypes.bomb) return CellTypes.bomb;
    let bombCounter = 0;
    for (cell of getAdjacentCells(i, j)) {
        if (GameState.cellMatrix[cell.i][cell.j] == CellTypes.bomb)
            bombCounter++;
    }
    return bombCounter;
}

function flagCell(i, j) {
    let thisCell = getCellByCoordinate(i, j);
    if (!thisCell.classList.contains('opened')) {
        thisCell.classList.toggle('fa')
        thisCell.classList.toggle('fa-flag');
        thisCell.classList.toggle('cell-flag');
        GameState.flagCounter++;
    }
}

function openCell(i, j) {
    let thisCell = getCellByCoordinate(i, j);
    thisCell.classList.remove("fa", "fa-flag", "cell-flag");
    const cellType = getCellType(i, j);
    if (cellType == CellTypes.bomb) {
        thisCell.classList.add("opened", "cell-bomb");;
        thisCell.innerHTML = '<i class="fa fa-bomb"></i>';
        endGame(false);
    } else if (!thisCell.classList.contains("opened")){
        GameState.openCells++;
        thisCell.classList.remove("cell-undiscovered");
        thisCell.classList.add("opened");
        if (cellType == CellTypes.space) {
            for (cell of getAdjacentCells(i, j)) {
                openCell(cell.i, cell.j);
            }
        } else {
            thisCell.classList.add("cell-number");
            thisCell.textContent = cellType;
            thisCell.style.setProperty("color", CellColorMapping[cellType]);
        }
    }
    
    if (GameState.openCells == GameState.numberOfRows * GameState.numberOfColumns - GameState.numberOfBombs) {
        endGame(true);
    }
}

function getCellByCoordinate(i ,j) {
    return document.getElementById(`cell-${i}-${j}`);
}

function setPlayField(rows, columns, bombs) {
    GameState.cellMatrix = Array.matrix(rows, columns, CellTypes.space);

    // Generate bombs
    for (let i = 0 ; i < bombs ; i++) {
        let randomRow = getRandom(rows);
        let randomColumn = getRandom(columns);
        while (GameState.cellMatrix[randomRow][randomColumn] == CellTypes.bomb) {
            randomRow = getRandom(rows);
            randomColumn = getRandom(columns);
        }
        GameState.cellMatrix[randomRow][randomColumn] = CellTypes.bomb;
    }

    // Renders field
    divField.innerHTML = '';
    for (let i = 0 ; i < rows ; i++) {
        // let divRow = document.createElement('span');
        for (let j = 0 ; j < columns ; j++) {
            let cell = document.createElement('span');
            cell.id = `cell-${i}-${j}`;
            cell.classList.add('cell', 'cell-undiscovered');
            cell.addEventListener('mouseup', function(event) {onCellClick(event, i, j)});
            divField.appendChild(cell);
        }

    }
    divField.style.setProperty('grid-template-columns', `repeat(${columns}, 0fr)`);
}

function onCellClick(event, i, j) {
    if (event.button == MouseButtons.left && !getCellByCoordinate(i, j).classList.contains('fa-flag'))
        openCell(i, j);
    else if (event.button == MouseButtons.right)
        flagCell(i, j);
}