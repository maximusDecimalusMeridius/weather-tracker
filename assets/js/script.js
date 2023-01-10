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
let iconURL = "https://openweathermap.org/img/wn/"
let API_KEY = "&appid=38a8e3005a4683dccd22d2f534217a4a";

//Event Listeners
_ui.addEventListener("click", (event) => {
    event.preventDefault;
    if(_searchInput.value != undefined && _searchInput.value != ""){
        //If a new city name is input, display weather stats and 5-day forecast
        //Add search to search history and local storage
        //If search history length == 10, pop() the last value off
        if(event.target.id == "submit-button"){
            getWeather(_searchInput.value.trim());
        }
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
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error("The city you entered was not found");
    })
    .then(data => {
        if(pastSearchArray.find(city => city == data.name) == undefined){
            pastSearchArray.unshift(data.name);
            if(pastSearchArray.length > 10){
                pastSearchArray.pop();
            }
        }
        _searchInput.value = "";
        localStorage.setItem("pastSearches", JSON.stringify(pastSearchArray));
        populateSearchHistory();
        displayWeather(data);
        populateFiveDay(data);
    })
    .catch(error => {
        console.log(error);
        alert("City not found, please try again or attempt a different spelling!");
    })
}

//Displays weather details in main city window
function displayWeather(data){
    let tempInF = ((data.main.temp - 273.15) * 9/5) + 32;
    let tempInC = (data.main.temp - 273.15);
    let weatherIcon = data.weather[0].icon;
    let newImg = document.createElement("img");
    newImg.src = `${iconURL}${weatherIcon}.png`;
    newImg.title = data.weather[0].description;

    _cityAndDate.textContent = `${data.name} - ${formattedToday}\u00A0\u00A0`;
    _cityAndDate.appendChild(newImg);
    _cityTemp.textContent = `${tempInF.toFixed(2)}°F / ${tempInC.toFixed(2)}°C`;
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
                let weatherDesc = fiveData.list[i].weather[0].description;
                let temp = [(((fiveData.list[i].main.temp - 273.15) * 9/5) + 32).toFixed(2), (fiveData.list[i].main.temp - 273.15).toFixed(2)];
                let wind = (fiveData.list[i].wind.speed);
                let humidity = fiveData.list[i].main.humidity;
                let htmlArray = [date, weatherIcon, temp, wind, humidity];

                for(let j = 0; j < htmlArray.length; j++){
                    let newDiv = document.createElement("div");
                    switch(j){
                        case(0):
                            newDiv.textContent = htmlArray[j];
                            newDiv.className = "date-header";
                            _fiveDayCards[i].append(newDiv);
                            break;
                        
                        case(1):
                            let newImg = document.createElement("img");
                            newImg.src = `${iconURL}${weatherIcon}.png`;
                            newImg.title = weatherDesc;
                            _fiveDayCards[i].append(newImg);
                            break;

                        case(2):
                            newDiv.textContent = `Temp: ${htmlArray[j][0]}°F
                            \n\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0${htmlArray[j][1]}°C`;
                            _fiveDayCards[i].append(newDiv);
                            break;

                        case(3):
                            newDiv.textContent = `Wind: ${htmlArray[j]}mph`;
                            _fiveDayCards[i].append(newDiv);
                            break;

                        case(4):
                            newDiv.textContent = `Humidity: ${htmlArray[j]}%`;
                            _fiveDayCards[i].append(newDiv);
                            break;

                        default:
                            break;
                    }
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
_searchInput.value = "";