function bounce(element, bounceDurationSeconds, delayIncrement) {
    let delay = 0;
    const elementText = element.textContent;
    element.innerHTML = ''
    for (character of elementText) {
        let charElement = document.createElement('span');
        charElement.textContent = character;
        charElement.style.setProperty('position', 'relative');
        charElement.style.setProperty('top', '0px');
        charElement.style.setProperty('animation', `bounce ${bounceDurationSeconds}s ease-in-out ${delay}s infinite alternate`);
        charElement.style.setProperty('text-shadow', '0 10px 10px rgba(0, 0, 0, 0.4)');
        element.appendChild(charElement);
        delay += delayIncrement;
    }
}