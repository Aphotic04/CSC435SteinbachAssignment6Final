async function loadEvent() {
    const Events = await import("./modules/event.js");
    return Events;
}

async function loadApi() {
    const Api = await import("./modules/api.js");
    return Api;
}

async function loadUi() {
    const Ui = await import("./modules/api.js");
    return Ui;
}

async function handleGainerLoser() {
    const Api = await loadApi();

    var gainerData = await Api.fetchGainersLosers('gainers');
    var loserData = await Api.fetchGainersLosers('losers');

    gainerData = gainerData['tickers'];
    loserData = loserData['tickers'];

    const Ui = await loadUi();

    Ui.displayGainersLosers(gainerData, "gainers");
    Ui.displayGainersLosers(loserData, "losers");
}




await handleGainerLoser();


const Events = await loadEvent();

document.getElementById('txtStock').addEventListener('input', Events.debouncedSearchEvent);