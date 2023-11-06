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

function Filter() {
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
  //   console.log(e.country.indexOf(countrySearch))
  // );

  const filterSates =
    stateSearch.length < 1
      ? statesInSelectedCountry
      : statesInSelectedCountry.filter(
          (data) =>
            data.endsWith("country") ||
            data.toLocaleLowerCase().includes(stateSearch.toLocaleLowerCase())
        );

  const filterCities =
    citySearch.length < 1
      ? citiesInSelectedState
      : citiesInSelectedState.filter(
          (data) =>
            data.endsWith("state") ||
            data.toLocaleLowerCase().includes(citySearch.toLocaleLowerCase())
        );

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
            <div className="dataBox">
              <input
                type="search"
                className="searchBar"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
              />
              {filterCountries.map((data, i) => {
                const brokenString = data.country
                  .toLowerCase()
                  .split(countrySearch.toLowerCase());
                return (
                  <div
                    key={data.country}
                    className="Countrylist"
                    onClick={() =>
                      selectedCountries.includes(data.country)
                        ? setSelectedCountries((prev) =>
                            prev.filter(
                              (selectedCountry) =>
                                selectedCountry !== data.country
                            )
                          )
                        : setSelectedCountries((prev) => [
                            ...prev,
                            data.country,
                          ])
                    }
                  >
                    <input
                      type="checkbox"
                      id={data.country}
                      checked={selectedCountries.includes(data.country)}
                      onChange={() => {}}
                    />
                    <p>
                      {brokenString.map((str, i) => {
                        console.log(brokenString.length, i, "brokenString");
                        return (
                          <span key={i}>
                            {str === "" ? (
                              i !== brokenString.length - 1 && (
                                <span className="highlight normal">
                                  {console.log("called")}
                                  {countrySearch}
                                </span>
                              )
                            ) : i < brokenString.length - 1 ? (
                              <>
                                {console.log(str, "start")}
                                <span className="normal">{str}</span>
                                <span className="highlight normal">
                                  {countrySearch}
                                </span>
                              </>
                            ) : (
                              <>
                                {console.log(str, "end")}
                                <span className="normal">{str}</span>
                              </>
                            )}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                );
              })}
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
                filterSates.map((state, i) => {
                  const brokenString = state
                    .toLowerCase()
                    .split(stateSearch.toLowerCase());
                  console.log(brokenString);
                  return (
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
                        state.replace(" country", "")
                      ) : (
                        <p>
                          {brokenString.map((str, i) => {
                            return (
                              <span key={i}>
                                {str === "" ? (
                                  i !== brokenString.length - 1 && (
                                    <span className="highlight normal">
                                      {stateSearch}
                                    </span>
                                  )
                                ) : i < brokenString.length - 1 ? (
                                  <>
                                    <span className="normal">{str}</span>
                                    <span className="highlight normal">
                                      {stateSearch}
                                    </span>
                                  </>
                                ) : (
                                  <span className="normal">{str}</span>
                                )}
                              </span>
                            );
                          })}
                        </p>
                      )}
                    </div>
                  );
                })
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
                filterCities.map((city, i) => {
                  const brokenString = city
                    .toLowerCase()
                    .split(citySearch.toLowerCase());

                  return (
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
                      {!city.endsWith("state") &&
                        !city.endsWith("available") && (
                          <input
                            type="checkbox"
                            id={city}
                            checked={selectedCities.includes(city)}
                            onChange={() => {}}
                          />
                        )}
                      {city.endsWith("state") ? (
                        city.replace(" state", "")
                      ) : (
                        <p>
                          {brokenString.map((str, i) => {
                            return (
                              <span key={i}>
                                {str === "" ? (
                                  i !== brokenString.length - 1 && (
                                    <span className="highlight normal">
                                      {citySearch}
                                    </span>
                                  )
                                ) : i < brokenString.length - 1 ? (
                                  <>
                                    <span className="normal">{str}</span>
                                    <span className="highlight normal">
                                      {citySearch}
                                    </span>
                                  </>
                                ) : (
                                  <span className="normal">{str}</span>
                                )}
                              </span>
                            );
                          })}
                        </p>
                      )}
                    </div>
                  );
                })
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

export default Filter;
