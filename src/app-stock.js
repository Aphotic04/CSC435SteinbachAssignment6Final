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

const thisStock = sessionStorage.getItem('currStock'); //Sets constant of clicked stock to get info on

/**
 * Formats unix millisecond timestamp to YYYY-MM-DD yy:mi.
 * @param {Integer} unixMs - Unix millisecend timestamp.
 * @returns {String} - Formatted datetime as string.
 */
function formatTimestamp(unixMs) {
    const date = new Date(unixMs); //New date object based on timestamp

    //Sets constants for needed info
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    //Returns formatted string
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

//Constants for file exports
const Ui = await loadUi();
const Api = await loadApi();
const Events = await loadEvent();

//Adds appropriate event listeners for search bar
document.getElementById('txtStock').addEventListener('input', Events.debouncedSearchEvent); //Input starts autocomplete feature
document.getElementById('txtStock').addEventListener('keydown', async (e) => { //Enter will submit vakue
    if(e.key === 'Enter') {
        await Events.clickStockSearch();
    }
});

const companyName = await handleCompanyDesc(); //Calls function to get/display company description and set companyName as const

await handleStockDesc(companyName); //Calls function to get/display stock snapshot, including company name

//When chart is ready
anychart.onDocumentReady(async function () {
            
    // Create a data table with loaded data
    var dataTable = anychart.data.table();
    dataTable.addData(await data());

    // Create a stock chart
    var chart = anychart.stock();
    // Create a plot
    var plot = chart.plot();
    // Create candlesticks with mapped data
    plot.candlestick(dataTable.mapAs({'open': 1, 'high': 2, 'low': 3, 'close': 4}));
    
    // Add a title
    chart.title('Current grouping level: 60 Minutes');
    
    // Specify a container
    chart.container('container');
    
    // Render the chart
    chart.draw();
    
    // Set data grouping:
    // create a grouping variable
    var grouping = chart.grouping();
    // set the initial grouping level to 5 minutes
    grouping.levels([{
        unit: 'minute',
        count: 60
    }]);
    // force the grouping
    grouping.forced(true);

    //Displays grouping options in select element
    await Ui.displayGrouping();
    
    //Whenever the select element is changed, change graph grouping
    document.getElementById('optGrouping').addEventListener('change', async (e) => {
        await Events.changeGrouping(e.target.value, grouping, chart);
    });
    
    // Set the initial gap
    var scale = chart.xScale();
    scale.minimumGap({intervalsCount: 1, unitType: 'min', unitCount: 1});

    
    // Create data
    async function data() {
        var stockData = await Api.fetchStock(thisStock); //Gets aggregate data
        stockData = stockData['results']; //Takes appropriate data

        var stockFormatted = []; //var for formatted data

        //For each data object, push appropriate data in new array and push that array to formatted array variable
        for (var i = 0; i < stockData.length; i++) {
            const thisAgg = stockData[i]; //Current object
            var aggArray = []; //New array for data

            //Pushes appropriate data
            aggArray.push(formatTimestamp(thisAgg['t']));
            aggArray.push(thisAgg['o']);
            aggArray.push(thisAgg['h']);
            aggArray.push(thisAgg['l']);
            aggArray.push(thisAgg['c']);

            //Pushes array to variable
            stockFormatted.push(aggArray);
        }
        //Return formatted data
        return stockFormatted;
    };

});

/**
 * Gets snapshot data and displays it with compay name.
 * @param {String} name - Name of company.
 */
async function handleStockDesc(name) {
    const data = await Api.fetchSnapshots(thisStock); //Fetches snapshot data

    await Ui.displayStockDesc(data['tickers'][0], name); //Displays data and name
}

/**
 * Gets company description data and displays it.
 * @returns {String} - Name of the company.
 */
async function handleCompanyDesc() {
    const data = await Api.fetchCompanyDesc(thisStock); //Fetches company description/info

    await Ui.displayCompanyDesc(data['results']); //Displays data

    return data['results']['name']; //Returns company name
}

/**
 * Gets related company tickers, according to ai, then gets snapshots of those tickers and displays them
 */
async function handleRelated() {
    var data = await Api.fetchAiRelated(thisStock); //Gets related companies according to AI

    data = JSON.parse(data['result']); //Use appropriate data

    var dataFormatted = ""; //Var to put formatted data

    //For each in data, place data in string
    for (var i = 0; i < data.length; i++) {
        //Ensures a comment after each value except at the end
        if (i < data.length - 1) {
            dataFormatted += data[i].ticker + ",";
        } else {
            dataFormatted += data[i].ticker
        }
        
    }

    const stockData = await Api.fetchSnapshots(dataFormatted); //Gets snapshot data of tickers

    await Ui.displaySnapshots(stockData['tickers'], 'relatedStocks'); //Displays that data
}

/**
 * Gets news related to ticker and displays it
 */
async function handleRelatedNews() {
    var data = await Api.fetchRelatedNews(thisStock,5); //Get max 5 articles related to the ticker

    data = data['results']; //Use appropriate data
    
    await Ui.displayNews(data, 'relatedNews'); //Display data
}

//Calling above functions
await handleRelatedNews();

await handleRelated();