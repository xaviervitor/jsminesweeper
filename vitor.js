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

function setTimer(element) {
    let start = performance.now();
    let interval = setInterval(function () {
        let delta = performance.now() - start;
        let seconds = Math.floor(delta / 1000);
        if (seconds > 999) {
            clearInterval(interval);
        }
        element.textContent = seconds;
    }, 1000);
    return interval;
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

function msToTime(s) {
    // Pad to 2 or 3 digits, default is 2
    function pad(n, z = 2) {
        return ('00' + n).slice(-z);
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return `${(hrs) ? pad(hrs) + ':' : ''}${(mins) ? pad(mins) + ':' : ''}${pad(secs)}.${pad(ms, 3)}`;
}

function showModal(title, body, buttonText, modalAction = function () { }) {
    document.getElementById("modal-custom-title").innerHTML = title;
    document.getElementById("modal-custom-body").innerHTML = body;
    let modalActionButton = document.getElementById("button-modal-custom");
    modalActionButton.innerHTML = buttonText;
    modalActionButton.addEventListener('click', modalAction);
    showElement(document.getElementById("modal-custom"), 'flex');
    for (element of document.querySelectorAll('.bouncing')) {
        bounce(element, 1, 0.2);
    }
}