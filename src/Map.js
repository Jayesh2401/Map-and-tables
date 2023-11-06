import React, { Fragment, useEffect, useMemo, useState } from "react";
import Map, { Label, Layer, Size, Tooltip } from "devextreme-react/vector-map";
import { customProjection } from "./customProjection";
import AllStates from "./statejson.json";
import AllCities from "./cityjson.json";
import data from "./countryjson.json";
import "./App.css";
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

function Maps() {
  const allData = useMemo(() => countries(), []);
  const [colorGroups2, setColorGroups2] = useState([]);
  const [statesInSelectedCountry, setStatesInSelectedCountry] = useState([]);
  const [centerCoords, setCenterCoords] = useState([]);
  const [subNationalCountry, setSubNationalCountry] = useState("Colombia");
  const [subNationalMap, setSubNationalMap] = useState({
    countryData: null,
    citiesData: null,
    mapBounds: null,
    zoomFactor: null,
  });
  const streamsPalette = [
    "#D1845A",
    "#DE8C5F",
    "#E99566",
    "#E79963",
    "#F4AB6C",
    "#FEBD77",
    "#FFDE94",
  ].reverse();

  // const mapBounds = [-180, 80, 0, -70];
  // const mapBounds = [-180, 85, 180, -60];

  useEffect(() => {

    setSubNationalMap((prev) => ({
      ...prev,
      zoomFactor: null,
      countryData: null,
      citiesData: null,
      mapBounds: null,
    })); 


    let c = AllStates.features.filter((feature) => {
      if (feature.properties["COUNTRY"] === subNationalCountry) {
        return feature;
      }
      return;
    });

    const d = {
      type: "FeatureCollection",
      features: c,
    };

    let city = AllCities.features.filter((feature) => {
      if (feature.properties["COUNTRY"] === subNationalCountry) {
        return feature;
      }
      return;
    });
    const dots = {
      type: "FeatureCollection",
      features: city,
    };

    subNationalCountry === "Colombia"
      ? setSubNationalMap((prev) => ({
          ...prev,
          mapBounds: [-180, 80, 0, -70],
        }))
      : setSubNationalMap((prev) => ({
          ...prev,
          mapBounds: [-180, 85, 180, -60],
        }));

    setSubNationalMap((prev) => ({
      ...prev,
      zoomFactor: 5,
      countryData: d,
      citiesData: dots,
      // mapBounds: mapBounds,
    }));
  }, [subNationalCountry]);

  const TooltipTemplate = (info) => {
    let name = info.attribute("SUB1");
    let CITY = info.attribute("CITY");
    let COUNTRY = info.attribute("COUNTRY");
    // console.log(name, CITY, COUNTRY);

    return <div>{name}</div>;
  };
  console.log(subNationalMap.zoomFactor, "zoomfactor");
  return (
    <div>
      <div>
        <div>
          <select onChange={(e) => setSubNationalCountry(e.target.value)}>
            <option>{subNationalCountry}</option>
            {allData.map((e, index) => (
              <Fragment key={index}>
                <option>{e.country}</option>
              </Fragment>
            ))}
          </select>
        </div>
        <div>
          <Map
            // defaultZoom={5}
            // minZoomFactor={subNationalMap.zoomFactor}
            // zoomFactor={5}

            zoomFactor={subNationalMap.zoomFactor}
            // maxZoomFactor={5}
            controls={false}
            bounds={subNationalMap?.mapBounds}
            colorGroupingField="total"
            projection={customProjection}
            id="map-container"
          >
            <Layer
              name="areas"
              palette={streamsPalette}
              dataSource={subNationalMap?.countryData}
              colorGroups={colorGroups2}
              colorGroupingField="total"
              label="enabled: true"
            >
              <Label enabled={true} />
            </Layer>
            <Layer
              name="marker"
              dataSource={subNationalMap?.citiesData}
              colorGroupingField="total"
              label="enabled: true"
            >
              <Label enabled={true} />
            </Layer>
            <Tooltip enabled={true} contentRender={TooltipTemplate} />
          </Map>
        </div>
      </div>
    </div>
  );
}

export default Maps;
