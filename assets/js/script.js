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
    if(event.target.id == "submit-button"){
        getWeather(_searchInput.value);
        pastSearchArray.push(_searchInput.value);
        _searchInput.value = "";
        localStorage.setItem("pastSearches", JSON.stringify(pastSearchArray));
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

function getWeather(city){
    fetch(weatherURL + city + API_KEY)
    .then(response => response.json())
    .then(data => {
        displayWeather(data);
        populateFiveDay(data);
    })
}

function displayWeather(data){
    let tempInF = ((data.main.temp - 273.15) * 9/5) + 32;
    let tempInC = (data.main.temp - 273.15);
    
    _cityAndDate.textContent = `${data.name} ${formattedToday}`;
    _cityTemp.textContent = `${tempInF.toFixed(2)}°`;
    _cityWind.textContent = `${data.wind.speed.toFixed(2)}mph`;
    _cityHumidity.textContent = `${data.main.humidity}%`;
}

function populateFiveDay(data){
    fetch(fiveDayURL + `lat=${data.coord.lat}&lon=${data.coord.lon}&cnt=5` + API_KEY)
        .then(response => response.json())
        .then( (fiveData) => {
            for(let i = 0; i < fiveData.list.length; i++){
                let date = today.add(i + 1, "day").format("MM/DD/YYYY");
                let weatherIcon = fiveData.list[i].weather[0].icon;
                let temp = (((fiveData.list[i].main.temp - 273.15) * 9/5) + 32).toFixed(2);
                let wind = (fiveData.list[i].wind.speed);
                let humidity = fiveData.list[i].main.humidity;

                console.log(date, weatherIcon, temp, wind, humidity);
                console.log("---------------");

                let htmlArray = [date, weatherIcon, temp, wind, humidity];

                for(let j = 0; j < htmlArray.length; j++){
                    let newDiv = document.createElement("div");
                    newDiv.textContent = htmlArray[j];
                    _fiveDayCards[i].append(newDiv);
                }
            }
        })
}