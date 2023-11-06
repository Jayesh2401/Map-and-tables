import { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { SlArrowUp } from "react-icons/sl";
import "./App.css";
import data from "./countryjson.json";

const countries = () => {
  const countries = [];
  for (const country in { ...data.detail }) {
    const countri = { ...data.detail };
    if (Object.hasOwnProperty.call(countri, country)) {
      const element = countri[country];
      countries.push({ country, state: element.states });
    }
  }
  return countries;
};

function App() {
  const allData = useMemo(() => countries(), []);
  const [countryDropDown, setCountryDropDown] = useState(false);
  const [stateDropDown, setStateDropDown] = useState(false);
  const [cityDropDown, setCityDropDown] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [statesInSelectedCountry, setStatesInSelectedCountry] = useState([]);
  const [citiesInSelectedStates, setCitiesInSelectedStates] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  useEffect(() => {
    setStatesInSelectedCountry([]);
    setCitiesInSelectedStates([]);
    allData.map(
      (data) => 
      selectedCountries.includes(data.country) &&
        setStatesInSelectedCountry((prev) => [
          ...prev,
          ...data.state.map((state) => state.geography),
        ])
    );
  }, [selectedCountries, allData]);

  console.log(selectedCountries.includes(data.country));

  return (
    <div>
      <div className="adjustment">
        <div>
          <div
            className="countriesdropdown"
            onClick={() => setCountryDropDown((prev) => !prev)}
          >
            {selectedCountries.length === 0 ? (
              <p>Select Country</p>
            ) : (
              selectedCountries.map((country) => `${country},`)
            )}
            <SlArrowUp />
          </div>
          {countryDropDown && (
            <div className="dataBox">
              {allData.map((data, i) => (
                <p
                  key={data.country}
                  className="Countrylist"
                  onClick={() =>
                    selectedCountries.includes(data.country)
                      ? setSelectedCountries((prev) =>
                          prev.filter((country) => country !== data.country)
                        )
                      : setSelectedCountries((prev) => [...prev, data.country])
                  }
                >
                  <input
                    type="checkbox"
                    id={data.country}
                    checked={selectedCountries.includes(data.country)}
                    onChange={() => {}}
                  />
                  {data.country}
                </p>
              ))}
            </div>
          )}
        </div>
        <div>
          <div
            className="countriesdropdown"
            onClick={() => setStateDropDown((prev) => !prev)}
          >
            {selectedStates.length === 0 ? (
              <p>Select State</p>
            ) : (
              selectedStates.map((country) => `${country},`)
            )}
            <SlArrowUp />
          </div>
          {stateDropDown && (
            <div className="dataBox">
              {statesInSelectedCountry.map((state, i) => (
                <div
                  key={i}
                  className="Countrylist"
                  onClick={() => {
                    selectedStates.includes(state)
                      ? setSelectedStates((prev) =>
                          prev.filter((states) => states !== state)
                        )
                      : setSelectedStates((prev) => [...prev, state]);
                  }}
                >
                  {state}
                  <input
                    type="checkbox"
                    id={state}
                    checked={selectedStates.includes(state)}
                    onChange={() => {}}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div
            className="countriesdropdown"
            onClick={() => setCityDropDown((prev) => !prev)}
          >
            {selectedCities.length === 0 ? (
              <p>Select City</p>
            ) : (
              selectedCities.map((city) => `${city},`)
            )}
            <SlArrowUp />
          </div>
          {cityDropDown && (
            <div className="dataBox">
              {citiesInSelectedStates.map((state, i) => (
                <div
                  key={i}
                  className="Countrylist"
                  onClick={() => {
                    selectedCities.includes(state)
                      ? setSelectedCities((prev) =>
                          prev.filter((states) => states !== state)
                        )
                      : setSelectedCities((prev) => [...prev, state]);
                  }}
                >
                  {state}
                  <input
                    type="checkbox"
                    id={state}
                    checked={selectedCities.includes(state)}
                    onChange={() => {}}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
