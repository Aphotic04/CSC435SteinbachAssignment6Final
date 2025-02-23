function getTradingDates() {
    let now = new Date();
    
    // Convert to GMT time
    let gmtTime = new Date(now.toISOString());
    
    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    let dayOfWeek = gmtTime.getUTCDay();
    
    // Get hours in GMT
    let gmtHours = gmtTime.getUTCHours();

    // Adjust today's date based on market availability
    if (gmtHours < 9) {
        // If it's before 9:00 AM GMT, use yesterday
        gmtTime.setUTCDate(gmtTime.getUTCDate() - 1);
        dayOfWeek = gmtTime.getUTCDay();
    }

    // Handle weekends: If it's Saturday or Sunday, roll back to Friday
    if (dayOfWeek === 0) { // Sunday → Go back to Friday
        gmtTime.setUTCDate(gmtTime.getUTCDate() - 2);
    } else if (dayOfWeek === 6) { // Saturday → Go back to Friday
        gmtTime.setUTCDate(gmtTime.getUTCDate() - 1);
    }

    // Set tomorrow’s date (next trading day)
    let tomorrow = new Date(gmtTime);
    tomorrow.setUTCDate(gmtTime.getUTCDate() + 1);

    // Skip weekends when determining the next trading day
    if (tomorrow.getUTCDay() === 6) { // If Saturday, set to Monday
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 2);
    } else if (tomorrow.getUTCDay() === 0) { // If Sunday, set to Monday
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    }

    // Format as YYYY-MM-DD
    let todaysDate = gmtTime.toISOString().split('T')[0];
    let tomorrowsDate = tomorrow.toISOString().split('T')[0];

    return { todaysDate, tomorrowsDate };
}

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
    const content = `Please provide me with 20 large and popular companies with stocks in format of [{"ticker":"TCKR"}].`;
    const encodedContent = encodeURIComponent(content);
    const response = await fetchOutline(`../../api/fetch-ai-stocks.js?content=${encodedContent}`);
    return response;
}

export async function fetchAiRelated(ticker) {
    const content = `Please provide me with 10 companies similar or related to ${ticker} with stocks in format of [{"ticker":"TCKR"}].`;
    const encodedContent = encodeURIComponent(content);
    const response = await fetchOutline(`../../api/fetch-ai-stocks.js?content=${encodedContent}`);
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

export async function fetchRelatedNews(ticker) {
    const tickerCall = `ticker=${ticker}&`;
    const encodedContent = encodeURIComponent(tickerCall);
    const response = await fetchOutline(`../../api/fetch-news-stocks.js?ticker=${encodedContent}`);
    return response;
}

export async function fetchSnapshots(tickers) {
    const response = await fetchOutline(`../../api/fetch-snapshots.js?tickers=${tickers}`);
    return response;
}

export async function fetchStock(ticker) {
    const { todaysDate, tomorrowsDate } = getTradingDates();
    
    const response = await fetchOutline(`../../api/fetch-stock.js?ticker=${ticker}&today=${todaysDate}&tomorrow=${tomorrowsDate}`);
    return response;
}

export async function fetchCompanyDesc(ticker) {
    const response = await fetchOutline(`../../api/fetch-company-desc.js?ticker=${ticker}`);
    return response;
}