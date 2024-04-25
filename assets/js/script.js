document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', weatherSearch);

    // Display pinned cities from local storage
    displayPinnedCities();
});

const APIKey = "46a9fd4bc168e3e4a27f122d86d96c11";

function weatherSearch() {
    const city = document.querySelector(".input").value.trim(); // Trim to remove leading/trailing whitespace
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`;

    fetch(currentWeatherURL)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Display current weather data
        displayCurrentWeather(data);

        // Save searched city to local storage
        saveCityToLocalStorage(city);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    fetch(forecastURL)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Display 5-day forecast
        displayForecast(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function displayCurrentWeather(data) {
    // Display city name and current date
    const cityData = document.querySelector(".city-data");
    const currentDate = new Date().toLocaleDateString();
    cityData.textContent = `${data.name} (${currentDate})`;

    // Display weather icon
    const weatherIconCode = data.weather[0].icon;
    const weatherIconURL = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;
    const weatherIcon = document.createElement('img');
    weatherIcon.src = weatherIconURL;
    weatherIcon.alt = "Weather Icon";
    cityData.appendChild(weatherIcon);


    // Display temperature, wind, and humidity
    const temperature = document.createElement('p');
    temperature.textContent = `Temperature: ${data.main.temp} °F`;
    cityData.appendChild(temperature);

    const wind = document.createElement('p');
    wind.textContent = `Wind: ${data.wind.speed} mph`;
    cityData.appendChild(wind);

    const humidity = document.createElement('p');
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    cityData.appendChild(humidity);
}

function displayForecast(data) {
    const forecastContainer = document.querySelector('.five-day');
    forecastContainer.innerHTML = ''; // Clear existing content

    // Display forecast for each day
    for (let i = 0; i < data.list.length; i += 8) { // Data is provided in 3-hour intervals, so we skip every 8th entry to get daily forecast
        const dayData = data.list[i];
        const date = new Date(dayData.dt * 1000).toLocaleDateString();
        const temperature = dayData.main.temp;
        const windSpeed = dayData.wind.speed;
        const humidity = dayData.main.humidity;
        const weatherIcon = dayData.weather[0].icon; // Get weather icon code

        


        // Create a card for each day's forecast
        const icon = document.createElement('img');
        icon.src = `https://openweathermap.org/img/wn/${weatherIcon}.png`; // Set src attribute to the icon URL
        icon.alt = "Weather Icon";

        const forecastCard = document.createElement('div');
        forecastCard.classList.add('card');

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        const forecastInfo = document.createElement('p');
        forecastInfo.textContent = `${date}: Temperature: ${temperature} °F, Wind: ${windSpeed} mph, Humidity: ${humidity}%`;

        cardContent.appendChild(icon); // Append the weather icon
        cardContent.appendChild(forecastInfo);
        forecastCard.appendChild(cardContent);
        forecastContainer.appendChild(forecastCard);
    }
}

function saveCityToLocalStorage(city) {
    // Retrieve existing pinned cities from local storage
    let pinnedCities = JSON.parse(localStorage.getItem('pinnedCities')) || [];

    // Add the new city to the array
    pinnedCities.push(city);

    // Save the updated array back to local storage
    localStorage.setItem('pinnedCities', JSON.stringify(pinnedCities));

    // Update the displayed list of pinned cities
    displayPinnedCities();
}

function displayPinnedCities() {
    const pinnedCitiesContainer = document.querySelector('.pinned-cities');
    pinnedCitiesContainer.innerHTML = ''; // Clear existing content

    // Retrieve pinned cities from local storage
    const pinnedCities = JSON.parse(localStorage.getItem('pinnedCities')) || [];

    // Display each pinned city
    pinnedCities.forEach(city => {
        const cityElement = document.createElement('div');
        cityElement.textContent = city;
        pinnedCitiesContainer.appendChild(cityElement);
    });
}
