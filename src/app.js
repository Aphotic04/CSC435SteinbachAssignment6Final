/**
 * Loads JS file in code split format
 * @returns {Object} - Object storing exported data.
 */
async function loadEvent() {
    const Events = await import("./modules/event.js");
    return Events;
}
/**
 * Loads JS file in code split format
 * @returns {Object} - Object storing exported data.
 */
async function loadApi() {
    const Api = await import("./modules/api.js");
    return Api;
}
/**
 * Loads JS file in code split format
 * @returns {Object} - Object storing exported data.
 */
async function loadUi() {
    const Ui = await import("./modules/ui.js");
    return Ui;
}

//Makes constants of files with exported data
const Api = await loadApi();
const Ui = await loadUi();

/**
 * Calls gainer/loser APIs, takes the data, and displays ot.
 */
async function handleGainerLoser() {
    //Call API functions
    var gainerData = await Api.fetchGainersLosers('gainers');
    var loserData = await Api.fetchGainersLosers('losers');

    //Get appropriate date
    gainerData = gainerData['tickers'];
    loserData = loserData['tickers'];

    //Display data
    await Ui.displaySnapshots(gainerData, "gainers");
    await Ui.displaySnapshots(loserData, "losers");
}

/**
 * Calls news APIs, takes the data, and displays it
 */
async function handleNews() {
    var newsData = await Api.fetchNews(); //Call API functions

    newsData = newsData['results']; //Get appropriate data
    
    await Ui.displayNews(newsData, 'news'); //Display data
}

/**
 * Calls AI api to get popular stocks, filters the data, gets snapshots of those stocks, then displays it
 */
async function handleScrollBar() {
    var scrollData = await Api.fetchAiStocks(); //Call API function to get AI recommended popular stocks

    scrollData = JSON.parse(scrollData['result']); //Parses data

    var scrollDataFormatted = ""; //Sets empty string to put data

    //Formats data
    for (var i = 0; i < scrollData.length; i++) {
        if (i < scrollData.length - 1) {
            scrollDataFormatted += scrollData[i].ticker + ",";
        } else {
            scrollDataFormatted += scrollData[i].ticker
        }
    }

    const stockData = await Api.fetchSnapshots(scrollDataFormatted); //Calls API function to fetch snapshots based on data

    await Ui.displaySnapshots(stockData['tickers'], 'scroll'); //Displays data
}

const Events = await loadEvent(); //Makes constant of Event file with exported data

//Set function to be called upon any input in search bar
document.getElementById('txtStock').addEventListener('input', Events.debouncedSearchEvent);
//Sets function to be called upon pressing enter when in search bar
document.getElementById('txtStock').addEventListener('keydown', async (e) => {
    if(e.key === 'Enter') {
        await Events.clickStockSearch();
    }
});

//Calls the above functions
await handleGainerLoser();

await handleNews();

await handleScrollBar();



