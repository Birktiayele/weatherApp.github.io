const searchInput = document.querySelector("#searchInput");
(temp = document.getElementById("weather")),
(date = document.getElementById("date-time")),
(searchButton = document.querySelector("#searchButton"));
weatherIcon = document.querySelector("#weatherIcon");
windSpeed = document.querySelector("#windSpeed");
humidity = document.querySelector(".humidity");
(celciusBtn = document.querySelector(".celcius")),
(fahrenheitBtn = document.querySelector(".fahrenheit")),
(tempUnit = document.querySelectorAll(".temp-unit")),
(hourlyBtn = document.querySelector(".hourly")),
(weekBtn = document.querySelector(".week.active")),
(weather = document.querySelector(".weather")),
(desc = document.querySelector(".desc")),
(weatherCards = document.querySelector("#weather-cards"));
API = "6b998dbd7f25fa92cbe044d5258abe30";
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");
let currentUnit = "c";
let hourlyorWeek = "week";
let mainTemp = 0;

// function to get date and time
function getDateTime() {
  let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // 12 hours format
  hour = hour % 12;
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  let dayString = days[now.getDay()];
  return `${dayString}, ${hour}:${minute}`;
}

//Updating date and time
date.innerText = getDateTime();
setInterval(() => {
  date.innerText = getDateTime();
}, 1000);

// Function to change weather icons
function getIcon(condition) {
  if (condition === "cloudy-day") {
    return "icons/cloudyday.png";
  } else if (condition === "cloudy-night") {
    return "icons/cloudynight.png";
  } else if (condition === "rain") {
    return "icons/rain.png";
  } else if (condition === "sunny-day") {
    return "icons/day.png";
  } else if (condition === "night") {
    return "icons/night.png";
  } else {
    return "icons/Sidebar.png";
  }
}

//function to update Forecast
function updateForecast(data, unit, type) {
  let weatherCards = document.getElementById("weather-cards");
  weatherCards.innerHTML = "";
  let day = 0;
  let numCards = 0;
  if (type === "day") {
    numCards = 24;
  } else {
    numCards = 7;
  }
  for (let i = 0; i < numCards; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    let dayName = getHour(data[day].datetime);
    if (type === "week") {
      dayName = getDayName(data[day].datetime);
    }
    let dayTemp = data[day].temp;
    if (unit === "f") {
      dayTemp = celciusToFahrenheit(data[day].temp);
    }
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    if (unit === "f") {
      tempUnit = "°F";
    }
    card.innerHTML = `
      <h2 class="day-name">${dayName}</h2>
      <div class "card-icon">
        <img src="${iconSrc}" class="day-icon" alt="" />
      </div>
      <div class="day-temp">
        <h2 class="temp">${dayTemp}</h2>
        <span class="temp-unit">${tempUnit}</span>
      </div>  
    `;
    weatherCards.appendChild(card);
    day++;
  }
}

// Function to set weather details
const setWeatherDetails = (data) => {
  desc.innerHTML = data.weather[0].description;
  weather.innerHTML = Math.round(data.main.temp - 273.15) + "°c";
  mainTemp = data.main.temp;
  humidity.innerHTML = data.main.humidity + "%";
  windSpeed.innerHTML = data.wind.speed + "km/h";
  switch (data.weather[0].main) {
    case "Clouds":
      weatherIcon.src = "cloud.png";
      break;
    case "Clear":
      weatherIcon.src = "day.png";
      break;
    case "Rain":
      weatherIcon.src = "rain.png";
      break;
    case "Mist":
      weatherIcon.src = "mist.png";
      break;
    case "Snow":
      weatherIcon.src = "Snow.png";
      break;
    case "Haze":
      weatherIcon.src = "Haze.png";
      break;
  }
};

// Function to get hours from hh:mm:ss
function getHour(time) {
  if (time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
      hour = hour - 12;
      return `${hour}:${min} PM`;
    } else {
      return `${hour}:${min} AM`;
    }
  } else {
    return ""; // or handle the case when time is undefined
  }
}

// convert time to 12-hour format
function covertTimeTo12HourFormat(time) {
  let hour = time.split(":")[0];
  let minute = time.split(":")[1];
  let ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  let strTime = hour + ":" + minute + " " + ampm;
  return strTime;
}

// function to get day name from date
function getDayName(date) {
  let day = new Date(date);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day.getDay()];
}

// Function to call OpenWeather API
const callAPI = (id) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${id}`
  )
    .then((response) => {
      if (!response.ok) {
        alert("Check spelling of City and try again or Something Went Wrong!");
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      setWeatherDetails(data);
    })
    .catch((error) => console.log(error));
};


searchButton.addEventListener("click", (e) => {
  if (searchInput.value == "") {
    alert("Please Enter City Name.");
  } else {
    callAPI(API);
  }
});

// Event listener for search button click
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchButton.click();
  }
});

// Event listeners for temperature unit buttons
fahrenheitBtn.addEventListener("click", () => {
  changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
  changeUnit("c");
});


// Function to change temperature unit
function changeUnit(unit) {
  if (currentUnit !== unit) {
    currentUnit = unit;
    tempUnit.forEach((elem) => {
      elem.innerText = `°${unit.toUpperCase()}`;
    });
    if (unit === "c") {
      celciusBtn.classList.add("active");
      fahrenheitBtn.classList.remove("active");
      // Convert temperature to Celsius and update the display
      weather.innerHTML = Math.round(mainTemp - 273.15) + "°C";
    } else {
      celciusBtn.classList.remove("active");
      fahrenheitBtn.classList.add("active");
      // Convert temperature to Fahrenheit and update the display
      weather.innerHTML = Math.round((mainTemp - 273.15) * 1.8 + 32) + "°F";
    }
  }
}

// Initial API call on page load
searchButton.click();

// Initial API call on page load
const createWeatherCard = (cityName, weatherItem, index) => {
  const date = new Date(weatherItem.dt * 1000); // Convert timestamp to milliseconds
  const dayName = getWeekDayName(date.getDay());
  if (index === 0) {
    // HTML for the main weather card
    return `<div class="details">
                  <h2>${cityName} - ${dayName}</h2>
                  <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(
                    2
                  )}°C</h6>
                  <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                  <h6>Humidity: ${weatherItem.main.humidity}%</h6>
              </div>
              <div class="icon">
                  <img src="https://openweathermap.org/img/wn/${
                    weatherItem.weather[0].icon
                  }@4x.png" alt="weather-icon">
                  <h6>${weatherItem.weather[0].description}</h6>
              </div>`;
  } else {
    // HTML for the other five day forecast card
    return `<li class="card">
                  <h3> ${dayName} </h3>
                  <img src="https://openweathermap.org/img/wn/${
                    weatherItem.weather[0].icon
                  }@4x.png" alt="weather-icon">
                  <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(
                    2
                  )}°C</h6>
                  <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                  <h6>Humidity: ${weatherItem.main.humidity}%</h6>
              </li>`;
  }
};

// Function to get the day name from the day index (0 = Sunday, 1 = Monday, etc.)
const getWeekDayName = (dayIndex) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[dayIndex];
};

// Function to get weather details
const getWeatherDetails = (cityName, latitude, longitude) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API}`;

  fetch(WEATHER_API_URL)
    .then((response) => response.json())
    .then((data) => {
      // Filter the forecasts to get only one forecast per day
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      // Clearing previous weather data
      searchInput.value = "";
      currentWeatherDiv.innerHTML = "";
      weatherCardsDiv.innerHTML = "";

      // Creating weather cards and adding them to the DOM
      fiveDaysForecast.forEach((weatherItem, index) => {
        const html = createWeatherCard(cityName, weatherItem, index);
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML("beforeend", html);
        } else {
          weatherCardsDiv.insertAdjacentHTML("beforeend", html);
        }
      });
      // Fetch and display hourly weather data immediately
      getHourlyWeather(latitude, longitude);
    })
    .catch(() => {
      alert("An error occurred while fetching the weather forecast!");
    });
};

const getCityCoordinates = () => {
  const cityName = searchInput.value.trim();
  if (cityName === "") return;
  const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API}`;

  // Get entered city coordinates (latitude, longitude, and name) from the API response
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { lat, lon, name } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("An error occurred while fetching the coordinates!");
    });
};

const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords; // Get coordinates of user location
      // Get city name from coordinates using reverse geocoding API
      const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API}`;
      fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
          const { name } = data[0];
          getWeatherDetails(name, latitude, longitude);
        })
        .catch(() => {
          alert("An error occurred while fetching the city name!");
        });
    },
    (error) => {
      // Show alert if user denied the location permission
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation request denied. Please reset location permission to grant access again."
        );
      } else {
        alert("Geolocation request error. Please reset location permission.");
      }
    }
  );
};

searchButton.addEventListener("click", getCityCoordinates);
searchInput.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getCityCoordinates()
);

const getHourlyWeather = (latitude, longitude) => {
  const HOURLY_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&exclude=current,minutely,daily,alerts&appid=${API}`;

  fetch(HOURLY_API_URL)
    .then((response) => response.json())
    .then((data) => {
      // Clearing previous hourly weather data
      console.log(data);
      document.querySelector("#hourly-weather").innerHTML = "";
      const todayUTC = new Date();

      const yearUTC = todayUTC.getUTCFullYear();
      const monthUTC = String(todayUTC.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
      const dayUTC = String(todayUTC.getUTCDate()).padStart(2, "0");

      const formattedDateUTC = `${yearUTC}-${monthUTC}-${dayUTC}`;

  // Filter the data for the current day and the next day
data = data.list.filter((hourlyData) => {
  const dataDate = new Date(hourlyData.dt_txt + " UTC");

  // Adjust the condition to cover the next 48 hours
  const next48Hours = new Date(todayUTC.getTime() + 48 * 60 * 60 * 1000);

  return dataDate >= todayUTC && dataDate < next48Hours;
});
      data.forEach((hourlyWeatherItem, index) => {
        const html = createHourlyWeatherCard(hourlyWeatherItem, index);
        document
          .querySelector("#hourly-weather")
          .insertAdjacentHTML("beforeend", html);
      });
    })
    .catch(() => {
      alert("An error occurred while fetching the hourly weather forecast!");
    });
};

// Function to create hourly weather card
const createHourlyWeatherCard = (hourlyWeatherItem, index) => {
  const time = new Date(hourlyWeatherItem.dt * 1000).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  return `<li class="hourly-card">
              <h3>${time}</h3>
              <img src="https://openweathermap.org/img/wn/${
                hourlyWeatherItem.weather[0].icon
              }@2x.png" alt="hourly-weather-icon">
              <h6>Temp: ${(hourlyWeatherItem.main.temp - 273.15).toFixed(
                2
              )}°C</h6>
              <h6>Wind: ${hourlyWeatherItem.wind.speed} M/S</h6>
              <h6>Humidity: ${hourlyWeatherItem.main.humidity}%</h6>
          </li>`;
};


