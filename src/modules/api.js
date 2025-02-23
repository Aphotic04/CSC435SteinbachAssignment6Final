async function fetchOutline(url) {
    try {
        //Fetch data from API
        const response = await fetch(url);
        
        //If response is not ok, throw error
        if (response.status == 500) {
            throw new Error(`HTTP Error\nStatus: ${response.status} - ${response.statusText}`);
        }

        //Put data in constant after parsing
        const data = await response.json();

        console.log(data);
        //Return data
        return(data);

    } catch (error) { //Catch thrown error
        //Log and display error
        console.error("Error fetching data:", error);
        return null;
    }
}

export async function fetchStockSearch(ticker) {
    const response = await fetchOutline(`../../api/fetch-stock-search.js?ticker=${ticker}`);
    return response;
}

export async function fetchAiStocks() {
    const response = await fetchOutline(`../../api/fetch-ai-stocks.js`);
    return response;
}

export async function fetchGainersLosers(direction) {
    const response = await fetchOutline(`../../api/fetch-gainer-loser.js?direction=${direction}`);
    return response;
}

export async function fetchNews() {
    const response = await fetchOutline(`../../api/fetch-news-stocks.js`);
    return response;
}

export async function fetchSnapshots(tickers) {
    const response = await fetchOutline(`../../api/fetch-snapshots.js?tickers=${tickers}`);
    return response;
}

export async function fetchStock(ticker) {
    var todaysDate = new Date();
    var yesterdaysDate = new Date();

    if (todaysDate.getHours() < 10) {
        todaysDate.setDate(todaysDate.getDate() - 1);
        yesterdaysDate.setDate(todaysDate.getDate() - 2); // Subtract 1 day

        todaysDate = todaysDate.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
        yesterdaysDate = yesterdaysDate.toLocaleDateString('en-CA');
    } else {
        yesterdaysDate.setDate(todaysDate.getDate() - 1); // Subtract 1 day

        todaysDate = todaysDate.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
        yesterdaysDate = yesterdaysDate.toLocaleDateString('en-CA');
    }
    
    
    console.log(ticker);
    console.log(todaysDate);
    console.log(yesterdaysDate);
    const response = await fetchOutline(`../../api/fetch-stock.js?ticker=${ticker}&today=${todaysDate}&yesterday=${yesterdaysDate}`);
    return response;
}

export async function fetchCompanyDesc(ticker) {
    const response = await fetchOutline(`../../api/fetch-company-desc.js?ticker=${ticker}`);
    return response;
}