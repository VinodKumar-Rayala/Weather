import React, { useState } from "react";
import "./App.css";
import Autosuggest from "react-autosuggest";

const App = () => {
  const [location, setLocation] = useState();
  const [data, setData] = useState({});
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState({
    status: false,
    message: "",
  });

  const onSuggestionsFetchRequested = async ({ value }) => {
    try {
      let url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${city}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "4cad5ea45fmsh7539e28cbb37e76p1215b8jsnd3393b982f79",
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      });
      let res = await response.json();
      console.log(res, "RESSSSSSSSS1111");
      if (response.status === 200) {
        console.log(res.data, "RESSSSSSSSS");
        setSuggestions(
          res.data?.map((city) => ({
            name: city.city,
            country: city.country,
          }))
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleInputChange = (event, { newValue }) => {
    setCity(newValue);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };
  const getSuggestionValue = (suggestion) => suggestion.name;
  const searchLocation = async (event) => {
    try {
      setData({});

      let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=f7161eebe2f81820005198adf343bc31&units=metric`;
      if (event.key === "Enter") {
        // Call your handler function
        let res = await fetch(url, {
          type: "GET",
        });
        let response = await res.json();
        if (res.status === 200) {
          setError((prevState) => ({
            ...prevState,
            status: false,
            message: "",
          }));
          setData(response);
          setLocation("");
        } else {
          console.log(response, "WDCTFBHINJMK");
          setError((prevState) => ({
            ...prevState,
            status: true,
            message: response.message,
          }));
          setLocation("");
        }
      }
    } catch (e) {
      setError((prevState) => ({ ...prevState, status: true, message: e }));
      console.log(e);
      setLocation("");
    }
  };

  const renderSuggestion = (suggestion) => (
    <div className={{ color: "red" }}>
      {suggestion.name},{suggestion.country}
    </div>
  );

  console.log(suggestions, "suggestions");
  return (
    <div className="app">
      {/* <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          placeholder: "Enter city name",
          value: city,
          onChange: handleInputChange,
        }}
      /> */}
      <div className="search">
        <input
          type="text"
          placeholder="Enter Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyUp={searchLocation}
        />
      </div>
      {error.status && <p className="error">{error.message}</p>}
      {Object.keys(data).length > 0 && (
        <div className="container">
          <div className="top">
            <div className="location">
              <p>{data.name}</p>
            </div>
            <div className="temp">
              <h1>{data.main?.temp.toFixed()}°F</h1>
            </div>
            <div className="description">
              <p>Clouds</p>
            </div>
          </div>
          <div className="bottom">
            <div className="feel">
              <p className="bold"> {data.main?.feels_like.toFixed()}°F</p>
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              <p className="bold">{data.main?.humidity}%</p>
              <p>Humidity</p>
            </div>
            <div className="wind">
              <p className="bold">{data.wind?.speed}</p>
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
