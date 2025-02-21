export async function fetchStockSearch(ticker) {
    try {
        //Fetch data from API
        const response = await fetch(`./api/fetch-stock-search.js?ticker=${ticker}`);
        
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