/**
 * Chooses the appropriate data for fetching stocks.
 * @returns {Object} - Dates formatted as strings in YYYY-MM-DD.
 */
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

/**
 * Connects to serverless function via url to fetch API data.
 * @param {String} url - URL to serverless function for API call.
 * @returns {Object} - Data returned from serverless fetch.
 * @throws {Error} - Thrown if there is any type of issue fetching response from API.
 */
async function fetchOutline(url) {
    try {
        //Fetch data from API
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"  // Ensures cookie is sent
        });
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

/**
 * Connects to serverless function to attempt login with credentials.
 * @param {String} username - Username to login.
 * @param {String} password - Password to login.
 * @returns {Object} - Data returned from serverless login.
 * @throws {Error} - Thrown if there is any type of issue logging in.
 */
export async function login(username, password) {
    try {
        //Debug log
        console.log('Attempting login for:', username);

        //Fetches from serverless login function, including the correct data
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ username, password })
        });

        //If response is bad, throw error
        if (!response.ok) {
            throw new Error(data.error || `HTTP Error: ${response.status}`);
        }

        //Data returned
        const data = await response.json();

        //Log response and return data
        console.log('Login response:', data);
        return data;

    } catch (error) { //Catch any errors and log
        console.error("Login error:", error);
        throw error;
    }
}

/**
 * Calls fetch function to fetch using the provided url. Fetches 5 stocks that match with ticker.
 * @param {String} ticker - Stock ticker.
 * @returns {Object} - Data returned from fetch.
 */
export async function fetchStockSearch(ticker) {
    const response = await fetchOutline(`../../api/fetch-stock-search.js?ticker=${ticker}`);
    return response;
}

/**
 * Calls fetch function to fetch using the provided url. Fetches AI response of popular company tickers.
 * @returns {Object} - Data returned from fetch.
 */
export async function fetchAiStocks() {
    const content = `Please provide me with 20 large and popular companies with stocks in format of [{"ticker":"TCKR"}].`;
    const encodedContent = encodeURIComponent(content);
    const response = await fetchOutline(`../../api/fetch-ai-stocks.js?content=${encodedContent}`);
    return response;
}

/**
 * Calls fetch function to fetch using the provided url. Fetches AI response of stocks related to ticker.
 * @param {String} ticker - Stock ticker.
 * @returns {Object} - Data returned from fetch.
 */
export async function fetchAiRelated(ticker) {
    const content = `Please provide me with 10 companies similar or related to ${ticker} with stocks in format of [{"ticker":"TCKR"}].`;
    const encodedContent = encodeURIComponent(content);
    const response = await fetchOutline(`../../api/fetch-ai-stocks.js?content=${encodedContent}`);
    return response;
}

/**
 * Calls fetch function to fetch using the provided url. Fetches top 20 gainers or losers.
 * @param {String} direction - Either gainers or losers.
 * @returns {Object} - Data returned from fetch.
 */
export async function fetchGainersLosers(direction) {
    const response = await fetchOutline(`../../api/fetch-gainer-loser.js?direction=${direction}`);
    return response;
}

/**
 * Calls fetch function to fetch using the provided url. Fetches relevant stock news.
 * @returns {Object} - Data returned from fetch.
 */
export async function fetchNews() {
    const response = await fetchOutline(`../../api/fetch-news-stocks.js`);
    return response;
}

/**
 * Calls fetch function to fetch using the provided url. Fetches specified max amount of news related to ticker.
 * @param {String} ticker - Stock ticker.
 * @param {String} limit - Max amount of articles allows.
 * @returns {Object} - Data returned from fetch.
 */
export async function fetchRelatedNews(ticker, limit) {
    const tickerCall = `ticker=${ticker}&`;
    const encodedContent = encodeURIComponent(tickerCall);
    const response = await fetchOutline(`../../api/fetch-news-stocks.js?ticker=${encodedContent}&limit=${limit}`);
    return response;
}

/**
 * Calls fetch function to fetch using the provided url. Fetches snapshots of specified ticker(s).
 * @param {String} ticker - Stock ticker.
 * @returns {Object} - Data returned from fetch.
 */
export async function fetchSnapshots(tickers) {
    const response = await fetchOutline(`../../api/fetch-snapshots.js?tickers=${tickers}`);
    return response;
}

/**
 * Calls fetch function to fetch using the provided url. Fetches stock aggregate data in calculated time frame of specified ticker.
 * @param {String} ticker - Stock ticker.
 * @returns {Object} - Data returned from fetch.
 */
export async function fetchStock(ticker) {
    const { todaysDate, tomorrowsDate } = getTradingDates();
    
    const response = await fetchOutline(`../../api/fetch-stock.js?ticker=${ticker}&today=${todaysDate}&tomorrow=${tomorrowsDate}`);
    return response;
}

/**
 * Calls fetch function to fetch using the provided url. Fetches description of company with specified ticker.
 * @param {String} ticker - Stock ticker.
 * @returns {Object} - Data returned from fetch.
 */
export async function fetchCompanyDesc(ticker) {
    const response = await fetchOutline(`../../api/fetch-company-desc.js?ticker=${ticker}`);
    return response;
}