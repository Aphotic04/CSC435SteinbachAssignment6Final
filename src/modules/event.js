async function loadApi() {
    const Api = await import("./api.js");
    return Api;
}

async function loadUi() {
    const Ui = await import("./ui.js");
    return Ui;
}

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

async function stockSearchData() {
    const searchBar = document.getElementById('txtStock');
    const Api = await loadApi();

    var data = await Api.fetchStockSearch(searchBar.value.toUpperCase());
    data = data["results"];
    var filteredData = [];
    var tickers = [];
    var names = [];

    data.forEach(element => {
        tickers.push(element["ticker"]);
        names.push(element['name']);
    });

    filteredData.push(tickers);
    filteredData.push(names);
    return(filteredData);
}

async function stockSearchEvent() {
    const filteredData = await stockSearchData();
    const Ui = await loadUi();
    
    Ui.autocomplete(document.getElementById("txtStock"), filteredData[0], filteredData[1]);
}

export const debouncedSearchEvent = debounce(stockSearchEvent, 400);

export function clickNews(link) {
    window.open(link, "_blank");
}

export function clickStock() {
    sessionStorage.setItem('currStock', this.id);
    window.location.assign("./stock.html");
}

export function clickStockSearch() {
    const searchBar = document.getElementById('txtStock');
    const results = document.getElementById('results');
    const searchValue = searchBar.value;

    if (!/^[A-Z0-9.-]+$/.test(searchValue) || searchValue.length === 0 || !searchValue || searchValue.length > 10) {
        results.innerHTML = 'Invalid Ticker'
    } else {
        results.innerHTML = "";
        sessionStorage.setItem('currStock', searchValue);
        window.location.assign("./stock.html");
    }
    
}

export function changeGrouping(option, grouping, chart) {
    grouping.levels([{unit: 'minute', count: parseInt(option)}]);
    chart.title(`Current grouping level: ${option} minutes`);
}