let currCity = "London";
let units = "metric";

// Selectors
let city = document.querySelector(".weather__city");
let currentDateELement = document.querySelector(".weather__datetime ");
let weather__forecast = document.querySelector(".weather__forecast");
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__realfeel = document.querySelector(".weather__realfeel");
let weather__humidity = document.querySelector(".weather__humidity");
let weather__wind = document.querySelector(".weather__wind");
let weather__pressure = document.querySelector(".weather__pressure");

// search
document.querySelector(".weather__search").addEventListener("submit", (e) => {
  let search = document.querySelector(".weather__searchform");
  // prevent default action
  e.preventDefault();
  // change current city
  currCity = search.value;
  console.log(currCity);

  fetchData();
  // clear form
  search.value = "";
});

// units
document
  .querySelector(".weather_unit_celsius")
  .addEventListener("click", () => {
    if (units !== "metric") {
      // change to metric
      units = "metric";
      // get weather forecast
      getWeather();
    }
  });

document
  .querySelector(".weather_unit_farenheit")
  .addEventListener("click", () => {
    if (units !== "imperial") {
      // change to imperial
      units = "imperial";
      // get weather forecast
      getWeather();
    }
  });

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let day = date.getDay();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let formattedDay = days[day];
  return `${formattedDay} ${hours}:${minutes}`;
}

let currentDate = new Date();

currentDateELement.innerHTML = formatDate(currentDate);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function fetchData() {
  const API_KEY = "e84352t57bcfd38870b8f1603bcaa4o4";
  const firstApiPromise = fetch(
    `https://api.shecodes.io/weather/v1/current?query=${currCity}&key=${API_KEY}&units=${units}`
  ).then((response) => response.json());
  const secondApiPromise = fetch(
    `https://api.shecodes.io/weather/v1/forecast?query=${currCity}&key=${API_KEY}&units=${units}`
  ).then((response) => response.json());

  Promise.all([firstApiPromise, secondApiPromise])
    .then(([firstData, secondData]) => {
      console.log("First API data:", firstData);
      console.log("Second API data:", secondData);
      // using first api
      city.innerHTML = `${firstData.city}`;
      weather__temperature.innerHTML = `${firstData.temperature.current.toFixed()}&#176`;
      weather__icon.innerHTML = `   <img src=${firstData.condition.icon_url} />`;
      weather__realfeel.innerHTML = `${firstData.temperature.feels_like.toFixed()}&#176`;
      weather__humidity.innerHTML = `${firstData.temperature.humidity}%`;
      weather__wind.innerHTML = `${firstData.wind.speed} ${
        units === "imperial" ? "mph" : "m/s"
      }`;
      weather__pressure.innerHTML = `${firstData.temperature.pressure} hPa`;

      //using second data
      let forecastHtml = "";

      secondData.daily.forEach(function (day, index) {
        if (index < 7) {
          forecastHtml =
            forecastHtml +
            `
          <div class="weather-forecast-day">
            <div class="weather-forecast-date">${formatDay(day.time)}</div>
    
            <img src="${
              day.condition.icon_url
            }" class="weather-forecast-icon" />
            <div class="weather-forecast-temperatures">
              <div class="weather-forecast-temperature">
                <strong>${Math.round(day.temperature.maximum)}º</strong>
              </div>
              <div class="weather-forecast-temperature">${Math.round(
                day.temperature.minimum
              )}º</div>
            </div>
          </div>
        `;
        }
      });

      let forecastElement = document.querySelector("#forecast");
      forecastElement.innerHTML = forecastHtml;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

document.body.addEventListener("load", fetchData());
