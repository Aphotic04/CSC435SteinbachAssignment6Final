async function loadEvent() {
    const Events = await import("./modules/event.js");
    return Events;
}

async function loadApi() {
    const Api = await import("./modules/api.js");
    return Api;
}

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
    dataTable.addData(data());

    // Create a stock chart
    var chart = anychart.stock();
    // Create a plot
    var plot = chart.plot();
    // Create candlesticks with mapped data
    plot.candlestick(dataTable.mapAs({'open': 1, 'high': 2, 'low': 3, 'close': 4}));
    
    // Add a title
    chart.title('Current grouping level: 5 minutes');
    
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
        count: 5
    }]);
    // force the grouping
    grouping.forced(true);
    
    // Change grouping to 1 minute on button click
    document
        .getElementById('1minBtn')
        .addEventListener('click', function() {
        grouping.levels([{unit: 'minute', count: 1}]);
        scale.minimumGap({intervalsCount: 10, unitType: 'sec', unitCount: 1});
        chart.title('Current grouping level: 1 minute');
        });
    
    // Change grouping to 5 minutes on button click
    document
        .getElementById('5minBtn')
        .addEventListener('click', function() {
        grouping.levels([{unit: 'minute', count: 5}]);
        scale.minimumGap({intervalsCount: 1, unitType: 'min', unitCount: 1});
        chart.title('Current grouping level: 5 minutes');
        });
    
    // Change grouping to 10 minutes on button click
    document
        .getElementById('10minBtn')
        .addEventListener('click', function() {
        grouping.levels([{unit: 'minute', count: 10}]);
        scale.minimumGap({intervalsCount: 3, unitType: 'min', unitCount: 1});
        chart.title('Current grouping level: 10 minutes');
        });
    
    // Set the initial gap
    var scale = chart.xScale();
    scale.minimumGap({intervalsCount: 1, unitType: 'min', unitCount: 1});

    const Api = await loadApi();
    var stockData = await Api.fetchStock(sessionStorage.getItem('currStock'));
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
    // Create data
    function data() {
        return stockFiltered;
    };

});