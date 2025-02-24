/**
 * Loads JS file in code split format
 * @returns {Object} - Object storing exported data.
 */
async function Event() {
    const Events = await import("./modules/event.js");
    return Events;
}

//Upon clicking submit button, attempt logging in
document.getElementById('submit').addEventListener('click',Events.loginEvent);