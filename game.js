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

const CellTypes = {
    bomb: -1,
    space: 0
}

var GameState = {
    cellMatrix: 0,
    numberOfRows: 0,
    numberOfColumns: 0,
    numberOfBombs: 0,
    openCells: 0,
    timeStarted: 0,
    timeEnded: 0,
    flagCounter: 0,
    counterInterval: 0,
    mouseDownClickedCell: {
        i: -1,
        j: -1
    },
    clickedAdjacentCells: [],
    over: false
}

const MouseButtons = {
    left: 0,
    right: 2
}

const flagDisplay = document.getElementById("span-flag-display");
const timeDisplay = document.getElementById("span-time-display");
const emojiDisplay = document.getElementById("emoji-display");

function getAdjacentCells(i, j) {
    let cells = [];
    try { if (GameState.cellMatrix[i - 1][j - 1] != undefined) cells.push({ i: i - 1, j: j - 1 }); } catch (TypeError) { }
    try { if (GameState.cellMatrix[i - 1][j + 0] != undefined) cells.push({ i: i - 1, j: j + 0 }); } catch (TypeError) { }
    try { if (GameState.cellMatrix[i - 1][j + 1] != undefined) cells.push({ i: i - 1, j: j + 1 }); } catch (TypeError) { }
    try { if (GameState.cellMatrix[i + 0][j - 1] != undefined) cells.push({ i: i + 0, j: j - 1 }); } catch (TypeError) { }
    try { if (GameState.cellMatrix[i + 0][j + 0] != undefined) cells.push({ i: i + 0, j: j + 0 }); } catch (TypeError) { }
    try { if (GameState.cellMatrix[i + 0][j + 1] != undefined) cells.push({ i: i + 0, j: j + 1 }); } catch (TypeError) { }
    try { if (GameState.cellMatrix[i + 1][j - 1] != undefined) cells.push({ i: i + 1, j: j - 1 }); } catch (TypeError) { }
    try { if (GameState.cellMatrix[i + 1][j + 0] != undefined) cells.push({ i: i + 1, j: j + 0 }); } catch (TypeError) { }
    try { if (GameState.cellMatrix[i + 1][j + 1] != undefined) cells.push({ i: i + 1, j: j + 1 }); } catch (TypeError) { }
    return cells;
}

function openAllCells() {
    for (let i = 0; i < GameState.numberOfRows; i++) {
        for (let j = 0; j < GameState.numberOfColumns; j++) {
            const thisCell = getCellByCoordinate(i, j);
            const cellType = getCellType(i, j);
            if (cellType == CellTypes.bomb) {
                if (thisCell.classList.contains('cell-flag')) continue;
                thisCell.classList.remove("cell-undiscovered");
                thisCell.classList.add("cell-bomb");
            } else {
                if (thisCell.classList.contains('cell-flag')) {
                    thisCell.classList.add("cell-bomb-wrong");
                } else if (cellType != CellTypes.space) {
                    thisCell.classList.add("cell-number");
                    thisCell.textContent = cellType;
                    thisCell.style.setProperty("color", CellColorMapping[cellType]);
                }
                thisCell.classList.remove("cell-flag", "cell-undiscovered");
            }
        }
    }
}

function resetGame() {
    GameState.cellMatrix = 0;
    GameState.numberOfRows = 0;
    GameState.numberOfColumns = 0;
    GameState.numberOfBombs = 0;
    GameState.openCells = 0;
    GameState.timeStarted = 0;
    GameState.timeEnded = 0;
    GameState.flagCounter = 0;
    GameState.counterInterval = 0;
    GameState.over = false;
}

function startGame(field, rows, columns, bombs) {
    // Stops timer if it is running
    clearInterval(GameState.counterInterval);
    resetGame();
    GameState.counterInterval = setTimer(timeDisplay);
    GameState.timeStarted = performance.now();
    GameState.numberOfRows = rows;
    GameState.numberOfColumns = columns;
    GameState.numberOfBombs = bombs;
    timeDisplay.textContent = '0';
    flagDisplay.textContent = bombs;
    changeButtonEmoji('🥳');
    setPlayField(field, rows, columns, bombs);
}

function endGame(isGameWon) {
    GameState.timeEnded = performance.now();
    if (!GameState.over) {
        openAllCells();
        clearInterval(GameState.counterInterval);
        showEndgameModal(isGameWon);
        changeButtonEmoji((isGameWon) ? '😎' : '😤');
        GameState.over = true;
    }
}

function showEndgameModal(isGameWon) {
    let title = (isGameWon) ? "Congratulations! 🥳You Won The Game!" : "You lost it fam... 😔";
    let message = `
        Time elapsed: <span class="float-right">${msToTime(GameState.timeEnded - GameState.timeStarted)}</span><br/>
        Flags put: <span class="float-right">${GameState.flagCounter}</span>
    `;
    let buttonText = (isGameWon) ? "Smash it again 😎" : "Let me try again I can do it 😤";
    let buttonAction = function () {
        animateButtonPrimary(this);
        hideElement(document.getElementById("modal-custom"));
    }
    showModal((isGameWon) ? true : false, title, message, buttonText, buttonAction);
}

function changeButtonEmoji(emoji) {
    emojiDisplay.innerHTML = emoji;
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
        thisCell.classList.toggle('cell-flag');
        GameState.flagCounter += (thisCell.classList.contains('cell-flag')) ? 1 : -1;
        flagDisplay.textContent = GameState.numberOfBombs - GameState.flagCounter;
    }
}

function openCell(i, j) {
    const thisCell = getCellByCoordinate(i, j);
    if (thisCell.classList.contains("cell-flag"))                
        GameState.flagCounter--;
        flagDisplay.textContent = GameState.numberOfBombs - GameState.flagCounter;
    thisCell.classList.remove("cell-flag", "cell-undiscovered");
    const cellType = getCellType(i, j);
    if (!thisCell.classList.contains("opened")) {
        thisCell.classList.add("opened");
        thisCell.classList.remove("cell-undiscovered-active");
        GameState.openCells++;
        if (cellType == CellTypes.bomb) {
            thisCell.classList.add("cell-bomb-clicked");
            endGame(false);
        } else if (cellType == CellTypes.space) {
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

function getCellByCoordinate(i, j) {
    return document.getElementById(`cell-${i}-${j}`);
}

function setPlayField(field, rows, columns, bombs) {
    GameState.cellMatrix = Array.matrix(rows, columns, CellTypes.space);

    // Generate bombs
    for (let i = 0; i < bombs; i++) {
        let randomRow = getRandom(rows);
        let randomColumn = getRandom(columns);
        while (GameState.cellMatrix[randomRow][randomColumn] == CellTypes.bomb) {
            randomRow = getRandom(rows);
            randomColumn = getRandom(columns);
        }
        GameState.cellMatrix[randomRow][randomColumn] = CellTypes.bomb;
    }

    // Renders field
    field.innerHTML = '';
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let cell = document.createElement('span');
            cell.id = `cell-${i}-${j}`;
            cell.classList.add('cell', 'cell-undiscovered');
            cell.addEventListener('mouseup', function (event) { onCellMouseUp(event, cell, i, j) });
            cell.addEventListener('mousedown', function (event) { onCellMouseDown(event, cell, i, j) });
            field.appendChild(cell);
        }
    }
    field.style.setProperty('grid-template-columns', `repeat(${columns}, 0fr)`);
}

function onCellMouseDown(event, cell, i, j) {
    mouseDownAtCell(i, j);
    if (event.button == MouseButtons.left && cell.classList.contains("opened")) {
        for (adjacentCellCoordinates of getAdjacentCells(i, j)) {
            const adjacentCell = getCellByCoordinate(adjacentCellCoordinates.i, adjacentCellCoordinates.j)
            if (!adjacentCell.classList.contains("opened") && !adjacentCell.classList.contains('cell-flag')) {
                addActiveColorCells(adjacentCell);
            }
        }
    }
}

window.addEventListener('mouseout', function(){
    // Removes "active" colors from cells if the player
    // moves the cursor out before releasing click
    removeActiveColorCells();
});

function onCellMouseUp(event, cell, i, j) {
    if (isCellMouseDown(i, j)) 
        if (event.button == MouseButtons.left && !cell.classList.contains('cell-flag'))
            if (cell.classList.contains("opened"))
                for (adjacentCellCoordinates of getAdjacentCells(i, j)) {
                    const adjacentCell = getCellByCoordinate(adjacentCellCoordinates.i, adjacentCellCoordinates.j)
                    if (!adjacentCell.classList.contains('cell-flag'))
                        openCell(adjacentCellCoordinates.i, adjacentCellCoordinates.j);
                }
            else
                openCell(i, j);
        else if (event.button == MouseButtons.right)
            flagCell(i, j);
}

function addActiveColorCells(adjacentCell) {
    GameState.clickedAdjacentCells.push(adjacentCell);
    adjacentCell.classList.add("cell-undiscovered-active");
}

function removeActiveColorCells() {
    for (cell of GameState.clickedAdjacentCells)
        cell.classList.remove("cell-undiscovered-active");
    GameState.clickedAdjacentCells = []
}

function mouseDownAtCell(i, j) {
    GameState.mouseDownClickedCell.i = i;
    GameState.mouseDownClickedCell.j = j;
}

function isCellMouseDown(i, j) {
    return (i == GameState.mouseDownClickedCell.i && j == GameState.mouseDownClickedCell.j);
}