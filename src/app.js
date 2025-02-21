async function loadEvent() {
    const Events = await import("./modules/event.js");
    return Events;
}

async function loadApi() {
    const Api = await import("./modules/api.js");
    return Api;
}

const Events = await loadEvent();

const Api = await loadApi();

Api.fetchAiStocks();
document.getElementById('txtStock').addEventListener('input', Events.debouncedSearchEvent);