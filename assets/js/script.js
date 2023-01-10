//Tying into HTML elements
let _searchInput = document.getElementById("search-input");
let _submitButton = document.getElementById("submit-button");

let _cityTemp = document.getElementById("temp");
let _cityWind = document.getElementById("wind");
let _cityHumidity = document.getElementById("humidity");

let _ui = document.getElementById("ui");
let _pastSearchesWindow = document.getElementById("past-searches");
let _fiveDayForecastWindow = document.getElementById("five-day");

//Initialize local five day forecast array
let pastSearchArray = [];

//Event Listeners
_ui.addEventListener("click", (event) => {
    console.log(event.target);
})

//Local Storage initiatilization
if(localStorage.getItem("pastSearches") == null){
    localStorage.setItem("pastSearches", "");
}

//If pastSearches exists, set pastSearchArray to it to display
if(localStorage.getItem("pastSearches") != ""){
    pastSearchArray = JSON.parse(localStorage.getItem("pastSearches"));
}