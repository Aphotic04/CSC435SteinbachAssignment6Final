/**
 * Loads JS file in code split format
 * @returns {Object} - Object storing exported data.
 */
async function loadApi() {
    const Api = await import("./api.js");
    return Api;
}
/**
 * Loads JS file in code split format
 * @returns {Object} - Object storing exported data.
 */
async function loadUi() {
    const Ui = await import("./ui.js");
    return Ui;
}

/**
 * Debounces function a specified amount of time.
 * @param {function} func - Function to debounce.
 * @param {Integer} delay - Specified amount to delay/debounce.
 * @returns {Object} - Data returned from function.
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * Hnadles the API fetch for value in search bar.
 * @returns {Array} - Filtered data returned from function.
 */
async function stockSearchData() {
    const searchBar = document.getElementById('txtStock'); //Search bar element
    const Api = await loadApi(); //Imported Api file

    //Fetches stok search via ticker
    var data = await Api.fetchStockSearch(searchBar.value.toUpperCase());
    data = data["results"];//Changes to appropriate data

    //Vars for organizing data for autocomplete
    var filteredData = [];
    var tickers = [];
    var names = [];

    //Organizes
    data.forEach(element => {
        tickers.push(element["ticker"]);
        names.push(element['name']);
    });

    //Places in filtered data
    filteredData.push(tickers);
    filteredData.push(names);

    return(filteredData);
}

/**
 * Function to handle inputs and displaying the data.
 */
async function stockSearchEvent() {
    const searchBar = document.getElementById('txtStock'); //Search bar element
    const results = document.getElementById('results'); //Result element (where auto correct or invalid message shows)

    const searchValue = searchBar.value; //Value in search bar

    //Validates value
    if (!/^[A-Za-z0-9.-]+$/.test(searchValue) || searchValue.length === 0 || !searchValue || searchValue.length > 10) {
        results.innerHTML = 'Invalid Ticker'
    } else { //Else
        results.innerHTML = ""; //Reset results inner html
        const filteredData = await stockSearchData(); //Gets stock search data
        const Ui = await loadUi(); //Loads Ui file
        
        //Calls autocomplete function
        Ui.autocomplete(document.getElementById("txtStock"), filteredData[0], filteredData[1]);
    }
}

//Debounced function as exported const
export const debouncedSearchEvent = debounce(stockSearchEvent, 400);

/**
 * Redirects user to link in new tab.
 * @param {String} link - Link to direct user to.
 */
export function clickNews(link) {
    window.open(link, "_blank");
}

/**
 * Sets clicked stock in session storage and relocates user.
 */
export function clickStock() {
    sessionStorage.setItem('currStock', this.id);
    window.location.assign("./stock.html");
}

/**
 * Checks for invalid input from search bar, places ticker is session storage, and redirects user.
 */
export async function clickStockSearch() {
    const searchBar = document.getElementById('txtStock'); //Search bar element
    const results = document.getElementById('results'); //Results element
    const searchValue = searchBar.value.toUpperCase(); //Value in search bar

    const Api = await loadApi(); //Loads API file

    //Gets company description to ensure that this ticker does indeed exist
    const data = await Api.fetchCompanyDesc(searchValue);


    //If input is invalid, display message
    if (!/^[A-Z0-9.-]+$/.test(searchValue) || searchValue.length === 0 || !searchValue || searchValue.length > 10 || data['status'] === "NOT_FOUND") {
        results.innerHTML = 'Invalid Ticker'
    } else { //Else set ticker in session storage and redirect user
        results.innerHTML = "";
        sessionStorage.setItem('currStock', searchValue);
        window.location.assign("./stock.html");
    }
    
}

/**
 * Changes grouping of chart based on option.
 * @param {String} option - Option to change grouping to.
 * @param {Object} grouping - Chart object for grouping.
 * @param {Object} chart - Chart object.
 */
export function changeGrouping(option, grouping, chart) {
    grouping.levels([{unit: 'minute', count: parseInt(option)}]);
    chart.title(`Current grouping level: ${option} minutes`);
}

/**
 * Attempts a user login.
 * @param {Evemt} event - The event the function is called by.
 */
export async function loginEvent(event) {
    event.preventDefault();//Prevents submission

    const Api = await loadApi(); //Loads API file

    try {
        //Get text elements
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
       
        const result = await Api.login(username, password); //Attempt login

        console.log('Login successful:', result); //Display results
        
        // Redirect or update UI on success
        window.location.href = './search.html';
    } catch (error) {
        const Ui = await loadUi(); //Loads Ui file

        console.error('Login failed:', error.message); //Logs error

        Ui.displayLoginError(error); //Displays error
    }
}