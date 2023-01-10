//Tying into HTML elements
let _searchInput = document.getElementById("search-input");
let _submitButton = document.getElementById("submit-button");

let _cityAndDate = document.getElementById("city-date");
let _cityTemp = document.getElementById("temp");
let _cityWind = document.getElementById("wind");
let _cityHumidity = document.getElementById("humidity");

let _ui = document.getElementById("ui");
let _pastSearchesWindow = document.getElementById("past-searches");
let _fiveDayForecastWindow = document.getElementById("five-day");

let _fiveDayCards = document.getElementsByClassName("five-day-card");

//Initialize local five day forecast array
let pastSearchArray = [];
let today = dayjs();
let formattedToday = today.format("M/DD/YYYY");

//API URLs & Key
let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
let fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?";
let API_KEY = "&appid=38a8e3005a4683dccd22d2f534217a4a";

//Event Listeners
_ui.addEventListener("click", (event) => {
    event.preventDefault;
    //If a new city name is input, display weather stats and 5-day forecast
    //Add search to search history and local storage
    if(event.target.id == "submit-button"){
        getWeather(_searchInput.value);
        pastSearchArray.push(_searchInput.value);
        _searchInput.value = "";
        localStorage.setItem("pastSearches", JSON.stringify(pastSearchArray));
        populateSearchHistory();
    }
    //Search past city but don't add to search history since it already exists
    if(event.target.className == "past-city-search"){
        getWeather(event.target.textContent);
    }
})

//Local Storage initiatilization
if(localStorage.getItem("pastSearches") == null){
    localStorage.setItem("pastSearches", "");
}

//If pastSearches exists, set pastSearchArray to it to display
if(localStorage.getItem("pastSearches") != ""){
    pastSearchArray = (JSON.parse(localStorage.getItem("pastSearches")));
}

//Displays weather and updated 5-day forecast
function getWeather(city){
    fetch(weatherURL + city + API_KEY)
    .then(response => response.json())
    .then(data => {
        displayWeather(data);
        populateFiveDay(data);
    })
}

//Displays weather details in main city window
function displayWeather(data){
    let tempInF = ((data.main.temp - 273.15) * 9/5) + 32;
    let tempInC = (data.main.temp - 273.15);
    
    _cityAndDate.textContent = `${data.name} ${formattedToday}`;
    _cityTemp.textContent = `${tempInF.toFixed(2)}°`;
    _cityWind.textContent = `${data.wind.speed.toFixed(2)}mph`;
    _cityHumidity.textContent = `${data.main.humidity}%`;
}

//Displays weather details in 5-day results window
function populateFiveDay(data){
    fetch(fiveDayURL + `lat=${data.coord.lat}&lon=${data.coord.lon}&cnt=5` + API_KEY)
        .then(response => response.json())
        .then( (fiveData) => {
            for(let i = 0; i < fiveData.list.length; i++){
                //Reset 5-day forecast cards and get all relevant data
                _fiveDayCards[i].innerHTML = "";
                let date = today.add(i + 1, "day").format("MM/DD/YYYY");
                let weatherIcon = fiveData.list[i].weather[0].icon;
                let temp = (((fiveData.list[i].main.temp - 273.15) * 9/5) + 32).toFixed(2);
                let wind = (fiveData.list[i].wind.speed);
                let humidity = fiveData.list[i].main.humidity;
                let htmlArray = [date, weatherIcon, temp, wind, humidity];

                for(let j = 0; j < htmlArray.length; j++){
                    let newDiv = document.createElement("div");
                    switch(j){
                        case(2):
                            newDiv.textContent = `Temp: ${htmlArray[j]}`;
                            break;

                        case(3):
                            newDiv.textContent = `Wind: ${htmlArray[j]}`;
                            break;

                        case(4):
                            newDiv.textContent = `Humidity: ${htmlArray[j]}`;
                            break;

                        default:
                            newDiv.textContent = htmlArray[j];
                            break;
                    }
                    
                    _fiveDayCards[i].append(newDiv);
                }
            }
        })
}

//Populate on-screen search history
function populateSearchHistory(){
    _pastSearchesWindow.innerHTML = ""
    
    for(let i = 0; i < pastSearchArray.length; i++){
        let newDiv = document.createElement("div");
        newDiv.textContent = pastSearchArray[i];
        newDiv.className = "past-city-search";
        _pastSearchesWindow.append(newDiv);
    }
}

populateSearchHistory();