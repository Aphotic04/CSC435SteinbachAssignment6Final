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

async function handleGainerLoser() {
    var gainerData = await Api.fetchGainersLosers('gainers');
    var loserData = await Api.fetchGainersLosers('losers');

    gainerData = gainerData['tickers'];
    loserData = loserData['tickers'];

    await Ui.displaySnapshots(gainerData, "gainers");
    await Ui.displaySnapshots(loserData, "losers");
}

async function handleNews() {
    var newsData = await Api.fetchNews();

    newsData = newsData['results'];
    
    await Ui.displayNews(newsData, 'news');
}

async function handleScrollBar() {
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
    const stockData = await Api.fetchSnapshots(scrollDataFiltered);

    await Ui.displaySnapshots(stockData['tickers'], 'scroll');
}

const Events = await loadEvent();

document.getElementById('txtStock').addEventListener('input', Events.debouncedSearchEvent);
document.getElementById('txtStock').addEventListener('keydown', async (e) => {
    if(e.key === 'Enter') {
        await Events.clickStockSearch();
    }
});

await handleGainerLoser();

await handleNews();

await handleScrollBar();



