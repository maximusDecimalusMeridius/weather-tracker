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

//API URLs & Key
let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
let fiveDayURL = "";
let API_KEY = "38a8e3005a4683dccd22d2f534217a4a";

//Event Listeners
_ui.addEventListener("click", (event) => {
    event.preventDefault;
    if(event.target.id == "submit-button"){
        getWeather(_searchInput.value);
        _searchInput.value = "";
    }
})

//Local Storage initiatilization
if(localStorage.getItem("pastSearches") == null){
    localStorage.setItem("pastSearches", "");
}

//If pastSearches exists, set pastSearchArray to it to display
if(localStorage.getItem("pastSearches") != ""){
    pastSearchArray = JSON.parse(localStorage.getItem("pastSearches"));
}

function getWeather(city) {
    fetch(weatherURL + city + "&appid=" + API_KEY)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
}