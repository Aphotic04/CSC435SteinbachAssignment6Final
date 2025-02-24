async function loadEvent() {
    const Events = await import("./event.js");
    return Events;
}

export async function displaySnapshots(data, elementId) {
    const container = document.getElementById(elementId);

    const Event = await loadEvent();
    
    container.innerHTML = '';

    var symbol;
    var direction;
    var operator;
    for (var i = 0; i < data.length; i++) {
        const newContainer = document.createElement('div');
        const curr = data[i];
        const percent = parseFloat(curr['todaysChangePerc'].toFixed(3));

        newContainer.classList.add('snapshotElement');
        newContainer.id = curr['ticker'];

        newContainer.addEventListener('click', Event.clickStock);

        if (percent >= 0) {
            direction = "gainers";
            symbol = '⮝';
            operator = '+';
        } else {
            direction = "losers";
            symbol = '⮟';
            operator = '';
        }

        newContainer.innerHTML = `
            <p>
                <span class='${direction}'>${symbol}</span>
                ${curr['ticker']}
                <span class='${direction}'>${operator}${parseFloat(curr['todaysChangePerc']).toFixed(3)}%</span>
            </p>
            <p>
                <span class='${direction}'>$${operator}${parseFloat(curr['todaysChange']).toFixed(3)}</span>
                $${parseFloat(curr['day']['c']).toFixed(3)}
            </p>
        `;
        container.appendChild(newContainer);
    }
}

export async function displayNews(data, elementId) {
    const container = document.getElementById(elementId);
    const Event = await loadEvent();

    if (data.length > 0) {
        container.innerHTML = "";
    }

    for (var i = 0; i < data.length; i++) {
        const newContainer = document.createElement('div');
        const curr = data[i];

        newContainer.classList.add('newsArticle');

        newContainer.innerHTML = `
            <img src="${curr['image_url']}" alt="News article supporting image" loading="lazy" width="150px" height="75px">
            <strong>${curr['title']}</strong>
            <p>
                <span class='publish'>${curr['publisher']['name']}<br/>Released: ${curr['published_utc']} UTC<span>
            </p>
        `;

        newContainer.addEventListener("click", (e) => {
            Event.clickNews(curr['article_url'])
        });

        container.appendChild(newContainer);
    }
}





export async function displayGrouping() {
    const select = document.getElementById('optGrouping');

    select.innerHTML = `
        <option value="60">Select Grouping</option>
        <option value="1">1 Minute</option>
        <option value="5">5 Minutes</option>
        <option value="10">10 Minutes</option>
        <option value="30">30 Minutes</option>
        <option value="60">60 Minutes</option>
    `;
}

export async function displayStockDesc(data, name) {
    const stockDesc = document.getElementById('stockDesc');
    const percent = parseFloat(data['todaysChangePerc'].toFixed(3));
    var symbol;
    var direction;
    var operator;

    if (percent >= 0) {
        direction = "gainers";
        symbol = '⮝';
        operator = '+';
    } else {
        direction = "losers";
        symbol = '⮟';
        operator = '';
    }

    stockDesc.innerHTML = `
        <p class="fadedTicker">
            ${data['ticker']}
        </p>
        <p>
            <span class='${direction}'>${symbol}</span>
            ${name}
            <span class='${direction}'>${operator}${parseFloat(data['todaysChangePerc']).toFixed(3)}%</span>
        </p>
        <p>
            <span class='${direction}'>$${operator}${parseFloat(data['todaysChange']).toFixed(3)}</span>
            $${parseFloat(data['day']['c']).toFixed(3)}
        </p>
    `;
}

export async function displayCompanyDesc(data) {
    const companyDesc = document.getElementById('companyDesc');

    if (typeof data['description'] === 'undefined') {
        companyDesc.innerHTML = `
            <strong>About ${data['name']}</strong>
            <p>No description available. Sorry for the inconvenience.</p>
        `;
    } else {
        companyDesc.innerHTML = `
            <strong>About ${data['name']}</strong>
            <p>${data['description']}</p>
        `;
    }
    
}


export function autocomplete(inp, arr, arr1) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    var a, b, i, val = inp.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false;}
    currentFocus = -1;

    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", inp.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");

    /*append the DIV element as a child of the autocomplete container:*/
    document.getElementById('results').appendChild(a);

    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");

            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length) + "  (" + arr1[i] + ")";
            
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", async function(e) {
                const Event = await loadEvent();
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;

                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();

                Event.clickStockSearch();
            });
            a.appendChild(b);
        }
    }
 
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
        }
    }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}