var GameState = {
    cellStack: [],
    bombsSet: new Set(),
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
    moves: 0, 
    over: false
}

const MouseButtons = {
    left: 0,
    right: 2
}

const flagDisplay = document.getElementById("span-flag-display");
const timeDisplay = document.getElementById("span-time-display");
const emojiDisplay = document.getElementById("emoji-display");

function getAdjacentCells(x, y) {
    const cells = [];
    for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
            const a = x + i;
            const b = y + j;

            if (a <= GameState.numberOfRows - 1 && b <= GameState.numberOfColumns - 1 && a >= 0 && b >= 0) {
                cells.push({i: a, j: b});
            }
        }
    }
    return cells;
}

function openAllCells(isGameWon) {
    for (let i = 0; i < GameState.numberOfRows; i++) {
        for (let j = 0; j < GameState.numberOfColumns; j++) {
            const thisCell = getCellByCoordinate(i, j);
            const bombCount = getAdjacentBombCount(i, j);
            thisCell.classList.remove("cell-undiscovered");
            if (bombCount == -1) {
                if (thisCell.classList.contains('cell-flag')) {
                    thisCell.classList.add("cell-locked");
                } else if (isGameWon) {
                    thisCell.classList.add("cell-flag");
                    thisCell.classList.add("cell-locked");
                } else {
                    thisCell.classList.add("cell-bomb");
                }
            } else {
                if (thisCell.classList.contains('cell-flag')) {
                    thisCell.classList.add("cell-bomb-wrong");
                } else if (bombCount != 0) {
                    thisCell.classList.add("cell-number");
                    thisCell.textContent = bombCount;
                    thisCell.style.setProperty("color", `var(--cell-number-color-${bombCount})`);
                }
                thisCell.classList.remove("cell-flag");
            }
        }
    }
}

function resetGame() {
    GameState.bombsSet = new Set();
    GameState.numberOfRows = 0;
    GameState.numberOfColumns = 0;
    GameState.numberOfBombs = 0;
    GameState.openCells = 0;
    GameState.timeStarted = 0;
    GameState.timeEnded = 0;
    GameState.flagCounter = 0;
    GameState.counterInterval = 0;
    GameState.moves = 0;
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
        openAllCells(isGameWon);
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
        Flags put: <span class="float-right">${GameState.flagCounter}</span><br/>
        Moves: <span class="float-right">${GameState.moves}</span>
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

function isThereABombAt(i, j) {
    return GameState.bombsSet.has(`${i}:${j}`);
}

function getAdjacentBombCount(i, j) {
    if (isThereABombAt(i, j)) return -1;
    let bombCounter = 0;
    for (cell of getAdjacentCells(i, j)) {
        if (isThereABombAt(cell.i, cell.j))
            bombCounter++;
    }
    return bombCounter;
}

function toggleFlagCell(i, j) {
    let thisCell = getCellByCoordinate(i, j);
    if (!thisCell.classList.contains('opened')) {
        thisCell.classList.toggle('cell-flag');
        GameState.flagCounter += (thisCell.classList.contains('cell-flag')) ? 1 : -1;
        flagDisplay.textContent = GameState.numberOfBombs - GameState.flagCounter;
    }
}

function clickCell(i, j) {
    openCell(i, j);
    while (GameState.cellStack.length) {
        const cellInfo = GameState.cellStack.pop();
        const adjacentCells = getAdjacentCells(cellInfo.i, cellInfo.j);
        for (cell of adjacentCells) {
            openCell(cell.i, cell.j);
        }
    }
    GameState.cellStack = [];
    if (GameState.openCells == GameState.numberOfRows * GameState.numberOfColumns - GameState.numberOfBombs) {
        endGame(true);
    }
}

function openCell(i, j) {
    const thisCell = getCellByCoordinate(i, j);
    if (thisCell.classList.contains("opened")) return;
    GameState.openCells++;
    thisCell.classList.add("opened");
    thisCell.classList.remove("cell-flag", "cell-undiscovered", "cell-undiscovered-active");
    if (thisCell.classList.contains("cell-flag")) {
        GameState.flagCounter--;
        flagDisplay.textContent = GameState.numberOfBombs - GameState.flagCounter;
    }
    const bombCount = getAdjacentBombCount(i, j);
    if (bombCount == -1) {
        thisCell.classList.add("cell-bomb-clicked");
        GameState.cellStack = [];
        endGame(false);
    } else if (bombCount == 0) {
        GameState.cellStack.push({i: i, j: j});
    } else if (!thisCell.classList.contains("cell-bomb-wrong")) {
        thisCell.classList.add("cell-number");
        thisCell.textContent = bombCount;
        thisCell.style.setProperty("color", `var(--cell-number-color-${bombCount})`);
    }
}

function getCellByCoordinate(i, j) {
    return document.getElementById(`cell-${i}-${j}`);
}

function setPlayField(field, rows, columns, bombs) {
    // Generate bombs
    for (let i = 0; i < bombs; i++) {
        generateBomb();
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

function generateBomb() {
    let randomRow = getRandom(GameState.numberOfRows);
    let randomColumn = getRandom(GameState.numberOfColumns);
    while (isThereABombAt(randomRow, randomColumn)) {
        randomRow = getRandom(GameState.numberOfRows);
        randomColumn = getRandom(GameState.numberOfColumns);
    }

    GameState.bombsSet.add(`${randomRow}:${randomColumn}`);
}

function onCellMouseDown(event, cell, i, j) {
    if (GameState.over) return;
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
    if (GameState.over) return;
    if (!GameState.moves && GameState.numberOfRows * GameState.numberOfColumns != GameState.numberOfBombs)
        changeBombLocation(i, j);

    if (isCellMouseDown(i, j)) 
        if (event.button == MouseButtons.left && !cell.classList.contains('cell-flag')) {
            GameState.moves++;
            if (cell.classList.contains("opened"))
                for (adjacentCellCoordinates of getAdjacentCells(i, j)) {
                    const adjacentCell = getCellByCoordinate(adjacentCellCoordinates.i, adjacentCellCoordinates.j)
                    if (!adjacentCell.classList.contains('cell-flag'))
                        clickCell(adjacentCellCoordinates.i, adjacentCellCoordinates.j);
                }
            else
                clickCell(i, j);
        } else if (event.button == MouseButtons.right) {
            GameState.moves++;
            toggleFlagCell(i, j);
        }
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

function changeBombLocation(i, j) {
    if (isThereABombAt(i, j)) {
        generateBomb();
        GameState.bombsSet.delete(`${i}:${j}`);
    }
}