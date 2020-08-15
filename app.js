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
const modal = document.getElementById("modal-custom");

window.onload = function () {
    // Applies bouncy movement to all .bouncing classes
    for (element of document.querySelectorAll('.bouncing')) {
        bounce(element, 1, 0.2);
    }

    // Event binders
    divField.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    }, true);

    document.getElementById("form-config").addEventListener('submit', function () {
        event.preventDefault();
        resetAnimation(document.getElementById("button-play"));
        startGame(inputTextRows.value, inputTextColumns.value, inputTextBombs.value);
    });
    
    document.getElementById("button-restart").addEventListener('click', function () {
        startGame(inputTextRows.value, inputTextColumns.value, inputTextBombs.value);
    });

    document.getElementById("button-close-game").addEventListener('click', function (event) {
        resetAnimation(this);
        hideElement(divFullscreen);
    });

    document.getElementById("button-zoom-in").addEventListener('click', function (event) {
        resetAnimation(this);
        setFieldScale(fieldScale * 1.1);
    });

    document.getElementById("button-zoom-out").addEventListener('click', function (event) {
        resetAnimation(this);
        setFieldScale(fieldScale * 0.9);
    });

    document.getElementById("button-settings").addEventListener('click', function (event) {
        resetAnimation(this);
        let spanFlagDisplay = document.getElementById("span-flag-display");
        let spanTimeDisplay = document.getElementById("span-time-display");
        let title = "Game options";
        let body = `
            <div>
                <input type="checkbox" id="checkbox-flag-display" name="game-options" value="flag-display"
                ${(spanFlagDisplay.style.getPropertyValue('visibility') == 'visible') ? 'checked' : ''}>
                <label for="checkbox-bomb-flag">Display bomb flag counter</label>
            </div>  
            <div>
                <input type="checkbox" id="checkbox-time-display" name="game-options" value="time-display"
                ${(spanTimeDisplay.style.getPropertyValue('visibility') == 'visible') ? 'checked' : ''}>
                <label for="checkbox-time-elapsed">Display time elapsed</label>
            </div>
        `;
        let buttonText = 'Confirm';
        showModal(title, body, buttonText, function () {
            if (document.getElementById("checkbox-flag-display").checked) {
                spanFlagDisplay.style.visibility = 'visible';
            } else {
                spanFlagDisplay.style.visibility = 'hidden';
            }
            if (document.getElementById("checkbox-time-display").checked) {
                spanTimeDisplay.style.visibility = 'visible';
            } else {
                spanTimeDisplay.style.visibility = 'hidden';
            }
            hideElement(modal);
        });
    });

    
}

// Functions
function setFieldScale(newScale) {
    fieldScale = newScale;
    document.getElementById('div-game-container').style.setProperty('transform', `scale(${fieldScale})`);
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

function showEndgameModal(isGameWon) {
    let title = (isGameWon) ? "Congratulations! &#x1f973;<br/>You Won The Game!" : "You lost it fam... &#x1f614;";
    let message = `
        Time elapsed: <span class="pull-right">${msToTime(GameState.timeEnded - GameState.timeStarted)}</span><br/>
        Flags put: <span class="pull-right">${GameState.flagCounter}</span>
    `;
    let buttonText = (isGameWon) ? "Smash it again &#x1f60e;" : "I'll try again I can do it &#x1f624;";
    let buttonAction = function () {
        resetAnimation(this);
        hideElement(modal);
    }
    showModal(title, message, buttonText, buttonAction);
}

function onCellClick(event, i, j) {
    if (event.button == MouseButtons.left && !getCellByCoordinate(i, j).classList.contains('fa-flag'))
        openCell(i, j);
    else if (event.button == MouseButtons.right)
        flagCell(i, j);
}