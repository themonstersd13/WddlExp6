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

// weather icons
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThermometer,
  WiThermometerExterior
} from 'react-icons/wi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherApp = () => {
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const API_KEY = 'd1845658f92b31c64bd94f06f7188c9c';

  const fetchWeather = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod !== '200') throw new Error(data.message);
      setForecastData(data);
      localStorage.setItem('forecastData', JSON.stringify(data));
      setError('');
    } catch (err) {
      setError('Could not fetch weather data. Showing last known forecast.');
      const cached = localStorage.getItem('forecastData');
      if (cached) setForecastData(JSON.parse(cached));
    }
  };

  const handleSearch = () => {
    if (!location.trim()) return;
    fetchWeather(location.trim());
  };

  useEffect(() => {
    const cached = localStorage.getItem('forecastData');
    if (cached) setForecastData(JSON.parse(cached));
  }, []);

  const current = forecastData?.list?.[0];
  const forecastForDay = forecastData?.list?.slice(0, 8) || [];

  // pick an icon based on temperature
  const getTempIcon = (temp) => {
    if (temp >= 30) return <WiDaySunny className="weather-icon hot" />;
    if (temp >= 20) return <WiThermometerExterior className="weather-icon warm" />;
    if (temp >= 10) return <WiCloud className="weather-icon mild" />;
    if (temp >= 0)  return <WiSnow className="weather-icon cool" />;
    return <WiThermometer className="weather-icon cold" />;
  };

  // short descriptive text
  const getDescription = (temp) => {
    if (temp >= 30) return "It's a scorcher out there! Stay hydrated.";
    if (temp >= 20) return "Nice and warm—perfect day to be outdoors.";
    if (temp >= 10) return "A bit cool—grab a light jacket.";
    if (temp >= 0)  return "Chilly—bundle up!";
    return "Freezing cold—stay inside if you can!";
  };

  // chart data
  const chartData =
    forecastForDay.length > 0
      ? {
          labels: forecastForDay.map((item) => new Date(item.dt_txt).getHours() + ':00'),
          datasets: [
            {
              label: 'Temp (°C)',
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
    <div className="weather-container container">
      <h1 className="title">🌤 Weather Forecast</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city name"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button className="button" onClick={handleSearch}>
          🔍 Search
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {current && (
        <div className="current-card">
          <div className="current-header">
            <h2>{forecastData.city.name}</h2>
            {getTempIcon(current.main.temp)}
          </div>
          <p className="desc">{getDescription(current.main.temp)}</p>
          <p className="temp">{current.main.temp.toFixed(1)}°C</p>
          <p className="weather-text">{current.weather[0].description}</p>
        </div>
      )}

      {forecastForDay.length > 0 && (
        <div className="chart-wrapper">
          <Line data={chartData} options={{ responsive: true }} />
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
