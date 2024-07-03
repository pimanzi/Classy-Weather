import React from 'react';
import { useFetchWeather } from './useFetchWeather'; // Correct import statement

export default function App() {
  const { location, setLocation, weather, isLoading, displayLocation } =
    useFetchWeather();

  return (
    <div className="app">
      <h1>Classy Weather</h1>
      <div>
        <Input location={location} setLocation={setLocation}></Input>
      </div>
      {isLoading && <p className="loader">Loading......</p>}
      {weather.weathercode && (
        <Weather location={displayLocation} weather={weather} />
      )}
    </div>
  );
}

function Input({ location, setLocation }) {
  return (
    <input
      type="text"
      placeholder="Search from location ...."
      value={location}
      onChange={(e) => setLocation(e.target.value)}
    ></input>
  );
}

function Weather({ weather, location }) {
  const {
    temperature_2m_max: max,
    temperature_2m_min: min,
    time: dates,
    weathercode: codes,
  } = weather;

  return (
    <div>
      <h2>Weather {location}</h2>
      <ul className="weather">
        {dates.map((date, i) => (
          <Day
            max={max[i]}
            min={min[i]}
            date={date}
            codes={codes[i]}
            key={date}
          ></Day>
        ))}
      </ul>
    </div>
  );
}

function Day({ max, min, date, codes }) {
  return (
    <li className="day">
      <span>{getWeather(codes)}</span>
      <p>
        {new Date(date).getDate() === new Date().getDate()
          ? 'Today'
          : formatDay(date)}
      </p>
      <p>
        {Math.floor(min)}&deg; &mdash; <strong>{Math.ceil(max)}&deg;</strong>
      </p>
    </li>
  );
}

function getWeather(wmoCode) {
  const icons = new Map([
    [[0], '☀️'],
    [[1], '🌤'],
    [[2], '⛅️'],
    [[3], '☁️'],
    [[45, 48], '🌫'],
    [[51, 56, 61, 66, 80], '🌦'],
    [[53, 55, 63, 65, 57, 67, 81, 82], '🌧'],
    [[71, 73, 75, 77, 85, 86], '🌨'],
    [[95], '🌩'],
    [[96, 99], '⛈'],
  ]);

  const arr = Array.from(icons.keys()).find((key) => key.includes(wmoCode));
  if (!arr) return 'NOT FOUND';
  return icons.get(arr);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
  }).format(new Date(dateStr));
}
