Log In Credentials:
    username: testuser
    password: password123

Functionality:
    You are able to log in, and upon logging in you can click any of the gainers/losers/scroll bar stocks to be directed to the aggregate graph of that stock. You
    can also use the search bar to search a stock. Upon typing, there will be autocomplete options that you can click to place within the search bar. Whenever you
    press enter, it will direct you to page with an aggregate graph of recent stock activity. There is a select element you can use to chanfe the grouping timeframe
    of the graph. On this page you will be provided with related stocks, which you can click to be directed to the same page for that stock. The search bar is also 
    included at the top of the page with the same functionality as the previous.On both pages there are news articles you can click which will direct you to the news 
    page in a new tab. 

Purpose/Key Features:
    The purpose of this application is to provide a way to search stocks to see a detailed and semi-customizable aggregate graph of the stock's most recennt activity.
    This includes general helpful displays of stocks, such as the top gainers/loser of the day, or seeing related stocks of a specific stock.
    There are also general and related news articles provided. 
    This project includes AI integration, API calls, secured serverless functions and secure environmental variables.

How AI is used:
    AI is used to fetch some popular companies' tickers in the stock market. It is also used to get the tickers of companies that are similar to another company.
    This data is then displayed in their respective place.

Performance and Security Optimizing
    Performance 
        Performance was optimized by using serverless functions, seperating the code using ES6, taking advantage of async/await, implementing lazy loading on images,
        and using async/await on JS file imports as a form of code splitting via dynamic import.
    Security    
        All variable inputs (username, password, search bar) are protected by only allowing a specific length of values and only certain characters. Security is furthered
        by the use of environmental variables for storing sensitive information. There is also user authentication via username and password. The login only lasts a 
        specific amount of time and authentication is required upon API calls by the use of cookies. The request methods are all monitored and there is a limited amount
        of login attempts. There is also the inclusion of a JWT secret in the environmental variables. 