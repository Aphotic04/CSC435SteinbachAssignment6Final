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

const thisStock = sessionStorage.getItem('currStock');

async function handleStockDesc(Api, Ui, name) {
    const data = await Api.fetchSnapshots(thisStock);

    await Ui.displayStockDesc(data['tickers'][0], name);
}

async function handleCompanyDesc(Api, Ui) {
    const data = await Api.fetchCompanyDesc(thisStock);

    await Ui.displayCompanyDesc(data['results']);

    return data['results']['name'];
}

const Ui = await loadUi();
const Api = await loadApi();

const companyName = await handleCompanyDesc(Api, Ui);

await handleStockDesc(Api, Ui, companyName);

function formatTimestamp(unixMs) {
    const date = new Date(unixMs);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

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

    await Ui.displayGrouping();
    
    const Event = await loadEvent();

    document.getElementById('optGrouping').addEventListener('change', async (e) => {
        await Event.changeGrouping(e.target.value, grouping, chart);
    });
    
    // Set the initial gap
    var scale = chart.xScale();
    scale.minimumGap({intervalsCount: 1, unitType: 'min', unitCount: 1});

    
    // Create data
    async function data() {
        var stockData = await Api.fetchStock(thisStock);
        stockData = stockData['results'];

        var stockFiltered = [];

        for (var i = 0; i < stockData.length; i++) {
            const thisAgg = stockData[i];
            var aggArray = [];

            aggArray.push(formatTimestamp(thisAgg['t']));
            aggArray.push(thisAgg['o']);
            aggArray.push(thisAgg['h']);
            aggArray.push(thisAgg['l']);
            aggArray.push(thisAgg['c']);

            stockFiltered.push(aggArray);
        }
        console.log(stockFiltered)
        return stockFiltered;
    };

});

