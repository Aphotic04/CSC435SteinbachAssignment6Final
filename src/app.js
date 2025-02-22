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
    var newsData = await Api.fetchNews();

    newsData = newsData['results'];
    
    await Ui.displayNews(newsData);
}

async function handleScrollBar(Api, Ui) {
    var scrollData = await Api.fetchAiStocks();

    scrollData = JSON.parse(scrollData['result']);

    var scrollDataFiltered = "";

    for (var i = 0; i < scrollData.length; i++) {
        if (i < scrollData.length - 1) {
            scrollDataFiltered += scrollData[i].ticker + ",";
        } else {
            scrollDataFiltered += scrollData[i].ticker
        }
        
    }
    console.log(scrollDataFiltered);

    const stockData = await Api.fetchSnapshots(scrollDataFiltered);

    await Ui.displaySnapshots(stockData);
}


await handleGainerLoser(Api, Ui);

await handleNews(Api, Ui);

await handleScrollBar(Api, Ui);

const Events = await loadEvent();

document.getElementById('txtStock').addEventListener('input', Events.debouncedSearchEvent);