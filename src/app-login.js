/**
 * Loads JS file in code split format
 * @returns {Object} - Object storing exported data.
 */
async function loadEvent() {
    const Events = await import("./modules/event.js");
    return Events;
}

const Events = await loadEvent(); //Get Event file exports

//Upon clicking submit button, attempt logging in
document.getElementById('submit').addEventListener('click',Events.loginEvent);