import { useState, useEffect } from 'react';

export function useFetchWeather() {
  const [location, setLocation] = useState(function () {
    const storedValue = localStorage.getItem('location');
    return storedValue !== undefined ? storedValue : '';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState('');
  const [weather, setWeather] = useState({});

  useEffect(() => {
    async function fetchWeather() {
      try {
        if (location.length < 2) return setWeather({});
        setIsLoading(true);
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
        );
        const geoData = await geoRes.json();

        if (!geoData.results) throw new Error('Location not found');

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results[0];
        setDisplayLocation(`${name}   ${convertToFlag(country_code)}`);

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        const weatherData = await weatherRes.json();

        setWeather(weatherData.daily);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWeather();
    localStorage.setItem('location', location);
  }, [location]);

  return { location, setLocation, weather, isLoading, displayLocation };
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
