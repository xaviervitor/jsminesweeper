function showElement(element, mode = 'block') {
    element.classList.remove('d-none');
    element.classList.add('d-' + mode);
}

function hideElement(element) {
    element.classList.remove('d-block', 'd-flex');
    element.classList.add('d-none');
}

function resetAnimation(button) {
    button.addEventListener("animationend", function () {
        // Removes focus so that the next click animation plays
        button.blur();
    }); 
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}