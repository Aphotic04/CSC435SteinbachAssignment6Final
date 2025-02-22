async function loadEvent() {
    const Events = await import("./modules/event.js");
    return Events;
}

async function loadApi() {
    const Api = await import("./modules/api.js");
    return Api;
}

async function loadUi() {
    const Ui = await import("./modules/ui.js");
    return Ui;
}

const Api = await loadApi();
const Ui = await loadUi();

async function handleGainerLoser(Api, Ui) {
    var gainerData = await Api.fetchGainersLosers('gainers');
    var loserData = await Api.fetchGainersLosers('losers');

    gainerData = gainerData['tickers'];
    loserData = loserData['tickers'];

    await Ui.displayGainersLosers(gainerData, "gainers");
    await Ui.displayGainersLosers(loserData, "losers");
}

async function handleNews(Api, Ui) {
    var newsData = Api.fetchNews();

    newsData = newsData['results'];

    await Ui.displayNews(newsData);
}


await handleGainerLoser(Api, Ui);

await handleNews(Api, Ui);


const Events = await loadEvent();

document.getElementById('txtStock').addEventListener('input', Events.debouncedSearchEvent);