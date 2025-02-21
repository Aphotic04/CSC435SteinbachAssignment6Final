async function loadEvent() {
    const Events = await import("./modules/event.js");
    return Events;
}

const Events = await loadEvent();

document.getElementById('txtStock').addEventListener('input', Events.debouncedSearchEvent);