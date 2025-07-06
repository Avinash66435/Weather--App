const apiKey = "29b2ea0410177491952fc715a0ba0152"; // Your API key

async function getWeather() {
    const cityInput = document.getElementById("city");
    const city = cityInput.value.trim();
    const tempDiv = document.getElementById("temp-div");
    const weatherInfo = document.getElementById("weather-info");
    const hourlyForecast = document.getElementById("hourly-forecast");

    // Clear previous results
    tempDiv.innerHTML = "";
    weatherInfo.innerHTML = "";
    hourlyForecast.innerHTML = "";

    if (city === "") {
        weatherInfo.innerHTML = "<p style='color: red;'>Please enter a city name.</p>";
        return;
    }

    // Show loading state
    weatherInfo.innerHTML = "<p>Loading weather data...</p>";

    try {
        const encodedCity = encodeURIComponent(city);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        if (data.cod && data.cod !== 200) {
            throw new Error(data.message || "City not found");
        }

        // Display weather data
        tempDiv.innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <p style="font-size: 24px;">🌡️ ${Math.round(data.main.temp)}°C</p>
        `;

        const weatherIcon = getWeatherIcon(data.weather[0].main);
        
        weatherInfo.innerHTML = `
            <p>${weatherIcon} ${capitalizeFirstLetter(data.weather[0].description)}</p>
            <p>💧 Humidity: ${data.main.humidity}%</p>
            <p>🌬️ Wind Speed: ${(data.wind.speed * 3.6).toFixed(1)} km/h</p>
            <p>🔼 High: ${Math.round(data.main.temp_max)}°C</p>
            <p>🔽 Low: ${Math.round(data.main.temp_min)}°C</p>
        `;

    } catch (error) {
        console.error("Error fetching weather:", error);
        weatherInfo.innerHTML = `<p style="color: red;">Error: ${error.message}. Please try again.</p>`;
    }
}

// Helper functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getWeatherIcon(weatherMain) {
    const icons = {
        Thunderstorm: "⛈️",
        Drizzle: "🌧️",
        Rain: "🌧️",
        Snow: "❄️",
        Mist: "🌫️",
        Smoke: "💨",
        Haze: "🌫️",
        Dust: "💨",
        Fog: "🌫️",
        Sand: "💨",
        Ash: "🌋",
        Squall: "💨",
        Tornado: "🌪️",
        Clear: "☀️",
        Clouds: "☁️"
    };
    return icons[weatherMain] || "🌤️";
}

// Temporary mock for testing UI
function mockWeatherData() {
    return {
        name: "London",
        sys: { country: "GB" },
        main: { temp: 15, humidity: 65, temp_max: 17, temp_min: 12 },
        weather: [{ main: "Clouds", description: "cloudy" }],
        wind: { speed: 3.2 }
    };
}