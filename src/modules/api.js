export async function fetchStockSearch(ticker) {
    try {
        //Fetch data from API
        const response = await fetch(`../../api/fetch-stock-search.js?ticker=${ticker}`);
        
        //If response is not ok, throw error
        if (response.status == 500) {
            throw new Error(`HTTP Error\nStatus: ${response.status} - ${response.statusText}`);
        }

        //Put data in constant after parsing
        const data = await response.json();

        //Return data
        return(data);

    } catch (error) { //Catch thrown error
        //Log and display error
        console.error("Error fetching data:", error);
    }
}

export async function fetchAiStocks() {
    try {
        //Fetch data from API
        const response = await fetch(`../../api/fetch-ai-stocks.js`);
        
        //If response is not ok, throw error
        if (response.status == 500) {
            throw new Error(`HTTP Error\nStatus: ${response.status} - ${response.statusText}`);
        }

        //Put data in constant after parsing
        const data = await response.json();

        //Return data
        console.log(data);
        return data;
    } catch (error) { //Catch thrown error
        //Log and display error
        console.error("Error fetching data:", error);
    }
}

export async function fetchGainersLosers(direction) {
    try {
        //Fetch data from API
        const response = await fetch(`../../api/fetch-gainer-loser.js?direction=${direction}`);
        
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
    }
}

export async function fetchNews() {
    try {
        //Fetch data from API
        const response = await fetch(`../../api/fetch-news-stocks.js`);
        
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
    }
}

export async function fetchSnapshots(tickers) {
    try {
        //Fetch data from API
        const response = await fetch(`../../api/fetch-snapshots.js?tickers=${tickers}`);
        
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
    }
}