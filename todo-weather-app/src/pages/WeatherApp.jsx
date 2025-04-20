import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherApp = () => {
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const API_KEY = 'd1845658f92b31c64bd94f06f7188c9c';

  const fetchWeather = async (city) => {
    try {
      // Use the forecast API endpoint to get 5-day/3-hour forecast data.
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      // The forecast API returns a string "200" when successful.
      if (data.cod !== '200') {
        throw new Error(data.message);
      }

      setForecastData(data);
      localStorage.setItem('forecastData', JSON.stringify(data));
      setError('');
    } catch (err) {
      setError('Could not fetch weather data.');
      const cached = localStorage.getItem('forecastData');
      if (cached) setForecastData(JSON.parse(cached));
    }
  };

  const handleSearch = () => {
    if (!location.trim()) return;
    fetchWeather(location);
  };

  useEffect(() => {
    const cached = localStorage.getItem('forecastData');
    if (cached) setForecastData(JSON.parse(cached));
  }, []);

  // The forecast API returns data every 3 hours.
  // To display a whole day (24 hours), we can use the first 8 entries.
  const forecastForDay =
    forecastData && forecastData.list ? forecastData.list.slice(0, 8) : [];

  // Prepare chart data if we have forecast data.
  const chartData =
    forecastForDay.length > 0
      ? {
          labels: forecastForDay.map((item) => {
            // Extract hours from the forecast timestamp.
            const date = new Date(item.dt_txt);
            // Format to 24-hour clock (e.g., "14:00")
            return `${date.getHours()}:00`;
          }),
          datasets: [
            {
              label: 'Temperature (°C)',
              data: forecastForDay.map((item) => item.main.temp),
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              tension: 0.4,
              fill: true,
            },
          ],
        }
      : { labels: [], datasets: [] };

  return (
    <div className="weather-container">
      <h1>Weather App</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter city"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {forecastData && forecastData.list && forecastData.list.length > 0 && (
        <>
          <div className="current-weather">
            {/* Display city and the latest forecast */}
            <h2>{forecastData.city.name}</h2>
            <p>{forecastData.list[0].weather[0].description}</p>
            <h3>{forecastData.list[0].main.temp}°C</h3>
          </div>

          <div className="chart-container">
            <Line data={chartData} options={{ responsive: true }} />
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherApp;
