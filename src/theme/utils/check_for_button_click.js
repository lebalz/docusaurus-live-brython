/**
 * When using react-draggable, the click-event is not propagated
 * to the button on touch devices. Fix this by clicking the button
 * programmatically. 
 */
const checkForButtonClick = (event) => {
    if (!event.type || event.type.toLowerCase() !== 'touchend') {
        return;
    }
    var elem = event.target;
    if (!elem) {
        return;
    }
    while (elem.tagName.toLowerCase() !== 'button') {
        elem = elem.parentNode;
        if (!elem || !elem.tagName) {
            break;
        }
        if (elem.tagName.toLowerCase() === 'div') {
            if (elem.classList.contains('react-draggable')) {
                elem = null
                break;
            }
        }
    }
    if (elem) {
        // add the click to the end of the event queue
        setTimeout(() => elem.click(), 1);
    }
}

export { checkForButtonClick }