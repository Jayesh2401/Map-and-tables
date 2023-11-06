import { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { SlArrowUp } from "react-icons/sl";
import Highlighter from "react-highlight-words";
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
  console.log(countries);
  return countries;
};

function Test() {
  const allData = useMemo(() => countries(), []);
  const [countryDropDown, setCountryDropDown] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [stateDropDown, setStateDropDown] = useState(false);
  const [statesInSelectedCountry, setStatesInSelectedCountry] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [cityDropDown, setCityDropDown] = useState(false);
  const [citiesInSelectedState, setCitiesInSelectedState] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  useEffect(() => {
    setStatesInSelectedCountry([]);
    allData.map(
      (data) =>
        selectedCountries.includes(data.country) &&
        setStatesInSelectedCountry((prev) => [
          ...prev,
          `${data.country} country`,
          ...data.state.map((state) => state.geography),
        ])
    );
  }, [selectedCountries, allData]);

  useEffect(() => {
    setCitiesInSelectedState([]);
    allData.map(
      (data) =>
        selectedCountries.includes(data.country) &&
        data.state.map(
          (state) =>
            selectedStates.includes(state.geography) &&
            (state.cities_data.cities === null
              ? setCitiesInSelectedState((prev) => [
                  ...prev,
                  `${state.geography} state`,
                  "No City available",
                ])
              : setCitiesInSelectedState((prev) => [
                  ...prev,
                  `${state.geography} state`,
                  ...state.cities_data.cities.map((city) => city.geography),
                ]))
        )
    );
  }, [selectedStates, allData, selectedCountries]);

  useEffect(() => {
    selectedStates.map(
      (state) =>
        !statesInSelectedCountry.includes(state) &&
        setSelectedStates((prev) =>
          prev.filter(
            (unselectCountryStates) => unselectCountryStates !== state
          )
        )
    );
  }, [selectedStates, statesInSelectedCountry]);

  useEffect(() => {
    selectedCities.map(
      (city) =>
        !citiesInSelectedState.includes(city) &&
        setSelectedCities((prev) =>
          prev.filter((unselectStatecity) => unselectStatecity !== city)
        )
    );
  }, [citiesInSelectedState, selectedCities]);

  const filterCountries =
    countrySearch.length < 1
      ? allData
      : allData.filter((data) =>
          data.country
            .toLocaleLowerCase()
            .includes(countrySearch.toLocaleLowerCase())
        );

  // const check = filterCountries.map((e) =>
  //   e.country.slice(e.country.indexOf(countrySearch), e.country.length)
  // );
  // console.log();

  // const Highlight = ({ children, highlightIndex }) => (
  //   <strong className="highlighted-text">{children}</strong>
  // );

  // setTimeout(() => {
  // let textSearch = document.getElementById("india");
  // console.log(textSearch);
  // countrySearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // let Pattern = new RegExp(`${countrySearch}`, "gi");
  // textSearch.innerHTML = textSearch.textContent.replace(
  //   Pattern,
  //   (match) => `<mark>${match}</mark>`
  // );
  // }, 100);

  const filterSates =
    stateSearch.length < 1
      ? statesInSelectedCountry
      : statesInSelectedCountry.filter((data) =>
          data.toLocaleLowerCase().includes(stateSearch.toLocaleLowerCase())
        );

  const filterCities =
    citySearch.length < 1
      ? citiesInSelectedState
      : citiesInSelectedState.filter((data) =>
          data.toLocaleLowerCase().includes(citySearch.toLocaleLowerCase())
        );

  const handleSearches = (itm, search) => {
    return itm
      .toLowerCase()
      .replace(search.toLowerCase(), `<span style=color:red>${search}</span>`);
  };

  return (
    <div>
      <div className="adjustment">
        <div>
          <div
            className="countriesdropdown"
            onClick={() => {
              setCountryDropDown((prev) => !prev);
              setStateDropDown(false);
              setCityDropDown(false);
            }}
          >
            {selectedCountries.length === 0 ? (
              <p>Select Country</p>
            ) : selectedCountries.length > 1 ? (
              <p>Multple Countries</p>
            ) : (
              selectedCountries.map((country) => `${country}`)
            )}
            <SlArrowUp />
          </div>
          {countryDropDown && (
            <div className="dataBox" id="para">
              <input
                type="search"
                className="searchBar"
                value={countrySearch}
                onChange={(e) => {
                  setCountrySearch(e.target.value);
                }}
              />
              {filterCountries.map((data, i) => (
                <p
                  key={data.country}
                  className="Countrylist"
                  id={data.country}
                  onClick={() =>
                    selectedCountries.includes(data.country)
                      ? setSelectedCountries((prev) =>
                          prev.filter(
                            (selectedCountry) =>
                              selectedCountry !== data.country
                          )
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
                  <span
                    dangerouslySetInnerHTML={{
                      __html: handleSearches(data.country, countrySearch),
                    }}
                  />
                  {/* {data.country} */}
                  {/* {data.country.slice(
                    data.country.indexOf(countrySearch),
                    data.country.length
                  )} */}
                </p>
              ))}
            </div>
          )}
        </div>

        <div>
          <div
            className="countriesdropdown"
            onClick={() => {
              setStateDropDown((prev) => !prev);
              setCountryDropDown(false);
              setCityDropDown(false);
            }}
          >
            {selectedStates.length === 0 ? (
              <p>Select State</p>
            ) : selectedStates.length > 1 ? (
              <p>Multple states</p>
            ) : (
              selectedStates.map((state) => `${state}`)
            )}
            <SlArrowUp />
          </div>
          {stateDropDown && (
            <div className="dataBox">
              <input
                type="search"
                className="searchBar"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
              />
              {filterSates.length > 0 ? (
                filterSates.map((state, i) => (
                  <div
                    key={i}
                    className={
                      state.endsWith(`country`)
                        ? "Countrylist head"
                        : "Countrylist"
                    }
                    onClick={() => {
                      !state.endsWith(`country`) &&
                        (selectedStates.includes(state)
                          ? setSelectedStates((prev) =>
                              prev.filter(
                                (selectedState) => selectedState !== state
                              )
                            )
                          : setSelectedStates((prev) => [...prev, state]));
                    }}
                  >
                    {!state.endsWith(`country`) && (
                      <input
                        type="checkbox"
                        id={state}
                        checked={selectedStates.includes(state)}
                        onChange={() => {}}
                      />
                    )}
                    {state.endsWith(`country`) ? (
                      state.replace("country", " ")
                    ) : (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: handleSearches(state, stateSearch),
                        }}
                      />
                    )}

                    {/* {state.endsWith(`country`)
                      ? state.replace(" country", "")
                      : state} */}
                  </div>
                ))
              ) : (
                <div className="Countrylist">No country selcted</div>
              )}
            </div>
          )}
        </div>

        <div>
          <div
            className="countriesdropdown"
            onClick={() => {
              setCityDropDown((prev) => !prev);
              setStateDropDown(false);
              setCountryDropDown(false);
            }}
          >
            {selectedCities.length === 0 ? (
              <p>Select City</p>
            ) : selectedCities.length > 1 ? (
              <p>Multple cities</p>
            ) : (
              selectedCities.map((city) => `${city}`)
            )}
            <SlArrowUp />
          </div>
          {cityDropDown && (
            <div className="dataBox">
              <input
                type="search"
                className="searchBar"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
              />
              {filterCities.length > 0 ? (
                filterCities.map((city, i) => (
                  <div
                    key={i}
                    className={
                      city.endsWith("state")
                        ? "Countrylist head"
                        : "Countrylist"
                    }
                    onClick={() => {
                      !city.endsWith("state") &&
                        !city.endsWith("available") &&
                        (selectedCities.includes(city)
                          ? setSelectedCities((prev) =>
                              prev.filter(
                                (selectedCity) => selectedCity !== city
                              )
                            )
                          : setSelectedCities((prev) => [...prev, city]));
                    }}
                  >
                    {!city.endsWith("state") && !city.endsWith("available") && (
                      <input
                        type="checkbox"
                        id={city}
                        checked={selectedCities.includes(city)}
                        onChange={() => {}}
                      />
                    )}
                    {city.endsWith("state") ? city.replace(" state", "") : city}
                  </div>
                ))
              ) : (
                <div className="Countrylist">No state Selected</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Test;
