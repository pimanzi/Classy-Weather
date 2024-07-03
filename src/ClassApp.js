import React from 'react';
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

  const arr = icons.keys().find((key) => key.includes(wmoCode));
  if (!arr) return 'NOT FOUND';
  return icons.get(arr);
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
  }).format(new Date(dateStr));
}
class App extends React.Component {
  state = {
    location: 'kigali',
    isLoading: false,
    displayLocation: '',
    weather: {},
  };
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       location: 'lisbon',
  //       isLoading: false,
  //       displayLocation: '',
  //       weather: {},
  //     };
  //     this.fetchWeather = this.fetchWeather.bind(this);
  //   }

  handleSearch = (e) => {
    this.setState({ location: e.target.value });
  };

  fetchWeather = async () => {
    if (this.state.location.length < 2) return this.setState({ weather: {} });
    try {
      this.setState({ isLoading: true });
      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );
      const geoData = await geoRes.json();
      console.log(geoData);

      if (!geoData.results) throw new Error('Location not found');

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);
      this.setState({
        displayLocation: `${name} ${convertToFlag(country_code)}`,
      });

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      this.setState({ weather: weatherData.daily });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  componentDidMount() {
    this.setState({ location: localStorage.getItem('Location') || '' });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.location !== prevState.location) {
      this.fetchWeather();
      localStorage.setItem('Location', this.state.location);
    }
  }
  render() {
    return (
      <div className="app">
        <h1>Classy Weather</h1>
        <div>
          <Input
            location={this.state.location}
            handleSearch={this.handleSearch}
          ></Input>
        </div>
        {this.state.isLoading && <p className="loader">Loading......</p>}
        {this.state.weather.weathercode && (
          <Weather
            location={this.state.displayLocation}
            weather={this.state.weather}
          />
        )}
      </div>
    );
  }
}

class Input extends React.Component {
  render() {
    return (
      <input
        type="text"
        placeholder="Search from location ...."
        value={this.props.location}
        onChange={this.props.handleSearch}
      ></input>
    );
  }
}
class Weather extends React.Component {
  render() {
    const {
      temperature_2m_max: max,
      temperature_2m_min: min,
      time: dates,
      weathercode: codes,
    } = this.props.weather;

    const location = this.props.location;
    return (
      <div>
        <h2>Weather {location}</h2>
        <ul className="weather">
          {dates.map((date, i) => (
            <Day
              max={max.at(i)}
              min={min.at(i)}
              date={date}
              codes={codes.at(i)}
              key={date}
            ></Day>
          ))}
        </ul>
      </div>
    );
  }
}

class Day extends React.Component {
  render() {
    const { max, min, date, codes } = this.props;
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
}
export default App;
