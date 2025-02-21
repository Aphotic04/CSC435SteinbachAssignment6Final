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

    var data = await Api.fetchStockSearch(searchBar.value);
    data = data["results"];
    var tickers = [];

    data.forEach(element => {
        tickers.push(element["ticker"]);
    });

    return(tickers);
}

async function stockSearchEvent() {
    const tickers = await stockSearchData();
    const Ui = await loadUi();
    
    Ui.autocomplete(document.getElementById("txtStock"), tickers);
}

export const debouncedSearchEvent = debounce(stockSearchEvent, 400);