import React, { Fragment, useEffect, useState } from "react";
import { SlArrowUp } from "react-icons/sl";
// import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import datas from "./countryjson.json";

function Country() {
  const [alldata, setAlldata] = useState(Object.keys(datas.detail));
  const [drop, setDrop] = useState(true);
  const [dropstate, setDropstate] = useState(true);
  const [dropcity, setDropcity] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState("Country");
  const [stateselected, setStateSelected] = useState("State");
  const [cityselected, setCitySelected] = useState("City");
  const [statearray, setStatearray] = useState([]);
  const [cityarray, setCityarray] = useState(null);
  const [selectcountry, setSelectcountry] = useState([]);
  const [isChecked, setIschecked] = useState(false);

  const fetchData = (e, index) => {
    // setFormAffordability((prevState => ({ ...prevState, category: [{ value: 1, label: "Beer" }] })))
    setIschecked(!isChecked);
    console.log(e.target.checked, "checked");
    setSelectcountry((prvState) => [...prvState, { e: e.target.id, i: index }]);
    //  const data = alldata.filter((i)=> i !== e.target.id)
    // setAlldata(data);

    // (data)=>({...data , try : e.target.id })
    // console.log(data);
  };

  console.log(selectcountry, "selectcountry");

  return (
    <div style={{ height: "100vh" }}>
      <div className="adjustment">
        <div>
          <div
            className="countriesdropdown"
            onClick={() => {
              setDrop(!drop);
              setDropcity(true);
              setDropstate(true);
            }}
          >
            {" "}
            {selectedOptions} <SlArrowUp />{" "}
          </div>
          {!drop && (
            <div className="dataBox">
              {alldata.map((e, index) => (
                <div
                  className="Countrylist"
                  key={index}
                  onClick={() => {
                    setSelectedOptions(e);
                    setStatearray(Object.values(alldata)[index].states);
                  }}
                >
                  <input
                    type="checkbox"
                    id={e}
                    checked={isChecked[index]}
                    onChange={(e) => {
                      fetchData(e, index);
                    }}
                  />
                  <label htmlFor={e}>{e}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div
            className="countriesdropdown"
            onClick={() => {
              setDropstate(!dropstate);
              setDropcity(true);
              setDrop(true);
            }}
          >
            {stateselected} <SlArrowUp />
          </div>
          {!dropstate && (
            <div className="dataBox">
              {statearray.length > 0 ? (
                statearray.map((e, index) => (
                  <div
                    className="Countrylist"
                    key={index}
                    onClick={() => {
                      setCityarray(e.cities_data.cities);
                      setStateSelected(e.geography);
                    }}
                  >
                    <input
                      type="checkbox"
                      id={e.geography}
                      onChange={() => console.log(e.geography)}
                    />
                    <label htmlFor={e.geography}>{e.geography}</label>
                  </div>
                ))
              ) : (
                <div className="Countrylist">
                  <label>State</label>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div
            className="countriesdropdown"
            onClick={() => {
              setDropcity(!dropcity);
              setDrop(true);
              setDropstate(true);
            }}
          >
            {cityselected} <SlArrowUp />
          </div>
          {!dropcity && (
            <div className="dataBox">
              {cityarray !== null && cityarray.length > 0 ? (
                cityarray.map((e, index) => (
                  <div
                    className="Countrylist"
                    key={index}
                    onClick={() => {
                      setCitySelected(e.geography);
                    }}
                  >
                    <input
                      type="checkbox"
                      id={e.geography}
                      onChange={() => console.log(e.geography)}
                    />
                    <label htmlFor={e.geography}>{e.geography}</label>
                  </div>
                ))
              ) : (
                <div className="Countrylist">
                  <label>City</label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Country;
