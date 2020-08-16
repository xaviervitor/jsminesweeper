const Difficulties = {
    custom: {
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

// Globals
var fieldScale = 1;

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

    // Deactivates context menu that appears when the player 
    // right clicks the field 
    divField.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    }, true);
    
    document.getElementById("form-config").addEventListener('submit', function () {
        event.preventDefault();
        resetAnimation(document.getElementById("button-play"));
        if (inputTextBombs.value > inputTextRows.value * inputTextColumns.value) {
            const modalBody = `There are more bombs (${inputTextBombs.value}) then squares in the field (${inputTextRows.value * inputTextColumns.value}), maybe you missed something.`;
            showModal(false, 'Wait a minute... 😵', modalBody, 'Oh shit sorry', function () {
                hideElement(modal);
            });
        } else {
            startGame(divField, inputTextRows.value, inputTextColumns.value, inputTextBombs.value);
            showElement(divFullscreen, 'flex');
        } 
    });

    document.getElementById("button-restart").addEventListener('click', function () {
        resetAnimation(this);
        startGame(divField, inputTextRows.value, inputTextColumns.value, inputTextBombs.value);
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
        showSettingsModal();
    });
}

function showSettingsModal() {
    const spanFlagDisplay = document.getElementById("span-flag-display");
    const spanTimeDisplay = document.getElementById("span-time-display");
    const modalBody = `
            <div>
                <input type="checkbox" id="checkbox-flag-display" name="game-options" value="flag-display"
                ${(spanFlagDisplay.style.getPropertyValue('visibility') == 'visible') ? 'checked' : ''}>
                <label for="checkbox-flag-display">Display bomb flag counter</label>
            </div>  
            <div>
                <input type="checkbox" id="checkbox-time-display" name="game-options" value="time-display"
                ${(spanTimeDisplay.style.getPropertyValue('visibility') == 'visible') ? 'checked' : ''}>
                <label for="checkbox-time-display">Display time elapsed</label>
            </div>
        `;
    showModal(false, 'Game options', modalBody, 'Confirm', function () {
        const isCheckboxFlagChecked = document.getElementById("checkbox-flag-display").checked;
        const isCheckboxTimeChecked = document.getElementById("checkbox-time-display").checked;
        spanFlagDisplay.style.visibility = (isCheckboxFlagChecked) ? 'visible' : 'hidden';
        spanTimeDisplay.style.visibility = (isCheckboxTimeChecked) ? 'visible' : 'hidden';
        hideElement(modal);
    });
}

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