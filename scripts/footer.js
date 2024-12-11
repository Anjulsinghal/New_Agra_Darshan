const apiKey = '9f0578fc31eef9dfed4364d016718487';
const city = 'Agra'; // Replace with your city

// Function to fetch weather data
async function fetchWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        // Display weather information
        document.getElementById('weather').innerHTML = `
                <h3>${data.name}</h3>
                <p>Temperature: ${data.main.temp} °C</p>
                <p>Weather: ${data.weather[0].description}</p>
            `;
    } catch (error) {
        document.getElementById('weather').innerHTML = `<p>Error fetching weather data. Try again later.</p>`;
    }
}

// Call the function to fetch weather data
fetchWeather();