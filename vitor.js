function showElement(element, mode = 'block') {
    element.classList.remove('d-none');
    element.classList.add('d-' + mode);
}

function hideElement(element) {
    element.classList.remove('d-block', 'd-flex');
    element.classList.add('d-none');
}

function animateElementClass(element, cssClass) {
    element.classList.add(cssClass);
    element.addEventListener("animationend", function () {
        element.classList.remove(cssClass);
    });
}

function animateOverlayButton(button) {
    animateElementClass(button, 'overlay-button-click');
}

function animateButtonPrimary(button) {
    animateElementClass(button, 'button-primary-click');
}

function setTimer(element) {
    let start = performance.now();
    let interval = setInterval(function () {
        let delta = performance.now() - start;
        let seconds = Math.floor(delta / 1000);
        if (seconds >= 999) {
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

function showModal(applyBouncing, title, body, buttonText, modalAction = function () { }) {
    document.getElementById("modal-custom-title").innerHTML = title;
    document.getElementById("modal-custom-body").innerHTML = body;
    document.getElementById("button-modal-custom").innerHTML = buttonText;
    document.getElementById("button-modal-custom").addEventListener('click', modalAction);
    showElement(document.getElementById("modal-custom"), 'flex');
    if (applyBouncing) {
        for (element of document.querySelectorAll('.bouncing')) {
            bounce(element, 1, 0.2);
        }
    }
}