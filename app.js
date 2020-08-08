// Globals
var cellMatrix = [];

// Element definitions 
const formConfig = document.getElementById("form-config");
const inputTextFieldSize = document.getElementById("inputtext-field-size");
const inputTextBombNumber = document.getElementById("inputtext-bomb-number");
const divField = document.getElementById("div-field");

// Event binders
formConfig.addEventListener('submit', function() {
    event.preventDefault();
    setPlayField(inputTextFieldSize.value, inputTextBombNumber.value);
});

// Functions
function getRandomCell(fieldSize) {
    return Math.floor(Math.random() * fieldSize);
}

function setPlayField(fieldSize, bombNumber) {
    if (!fieldSize)
        return;

    // Cria campo limpo
    for (let i = 0 ; i < fieldSize ; i++) {
        for (let j = 0 ; j < fieldSize ; j++) {
            cellMatrix[i] = [];
            cellMatrix[i][j] = 0;
        }
    }

    // Gera 10 bombas
    for (let i = 0 ; i < bombNumber ; i++) {
        let randomRow = getRandomCell(fieldSize);
        let randomColumn = getRandomCell(fieldSize);
        while (cellMatrix[randomRow][randomColumn] == -1) {
            randomRow = getRandomCell(fieldSize);
            randomColumn = getRandomCell(fieldSize);
        }
        cellMatrix[randomRow][randomColumn] = -1;
    }

    // Renderiza campo
    divField.innerHTML = '';
    for (let i = 0 ; i < inputTextFieldSize.value ; i++) {
        let divRow = document.createElement('div');
        for (let j = 0 ; j < inputTextFieldSize.value ; j++) {
            let button = document.createElement('button');
            button.classList.add('cell');
            button.addEventListener('click', function(){
                onCellClick(i, j);
            });
            button.disabled = true;
            if (cellMatrix[i][j] == -1) {
                button.innerText = 'B';
            } else {
                button.innerHTML = '&nbsp;';
            }
            divRow.appendChild(button);
        }
        divField.appendChild(divRow);
    }
}

function onCellClick() {

}