import React, { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ComposedChart,
  Area,
  Label,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";

import * as mapsData from "devextreme/dist/js/vectormap-data/world.js";
import Map, {
  Label as Test,
  Layer,
  Tooltip as Tip,
} from "devextreme-react/vector-map";

function Recharts() {
  const [populationChartData, setPopulationChartData] = useState([
    {
      economic_outlook: "Base",
      locality: "India",
      populations: 657279858,
      year: 2022,
    },
  ]);
  const [colorGroups2, setColorGroups2] = useState([
    4389, 23893394, 71697030, 144713314, 235824863, 338289858, 1425887338,
  ]);
  const [mapData, setMapData] = useState(null);
  const [indicator, setIndicator] = useState("Population");

  const [selectedCountry, setSelectedCountry] = useState(["India", "Africa"]);
  const COLORS = [
    "#123A79",
    "#246EB9",
    "#77A8DA",
    "#974C3E",
    "#C57B57",
    "#F1B677",
    "#3A5B63",
    "#497A79",
    "#629F80",
    "#82242F",
    "#A53860",
    "#D66CA6",
  ];
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const [populationTime, setPopulationTime] = useState([
    { year: 2019, India: 334319671.0, Africa: 1425430776 },
    { year: 2020, India: 335942004.0, Africa: 1425430776 },
    { year: 2021, India: 336997625.0, Africa: 1425430776 },
    { year: 2022, India: 338289858.0, Africa: 1425430776 },
    { year: 2023, India: 339996564.0, Africa: 1425430776 },
    { year: 2024, India: 341814420.0, Africa: 1425430776 },
    { year: 2025, India: 343603403.0, Africa: 1425430776 },
    { year: 2026, India: 345364936.0, Africa: 1425430776 },
    { year: 2027, India: 347098261.0, Africa: 1425430776 },
    { year: 2028, India: 348804849.0, Africa: 1425430776 },
    { year: 2029, India: 350493333.0, Africa: 1425430776 },
    { year: 2030, India: 352162301.0, Africa: 1425430776 },
    { year: 2031, India: 353802974.0, Africa: 1425430776 },
  ]);

  const mapBounds = [-180, 85, 180, -60];
  const streamsPalette = [
    "#D1845A",
    "#DE8C5F",
    "#E99566",
    "#E79963",
    "#F4AB6C",
    "#FEBD77",
    "#FFDE94",
  ].reverse();

  const RADIANS = Math.PI / 180;
  const WAGNER_6_P_LAT = Math.PI / Math.sqrt(3);
  const WAGNER_6_U_LAT = 2 / Math.sqrt(3) - 0.1;

  const customProjection = {
    aspectRatio: 1.7,
    to(coordinates) {
      const x = coordinates[0] * RADIANS;
      const y = Math.min(
        Math.max(coordinates[1] * RADIANS, -WAGNER_6_P_LAT),
        +WAGNER_6_P_LAT
      );
      const t = y / Math.PI;
      return [(x / Math.PI) * Math.sqrt(1 - 3 * t * t), (y * 2) / Math.PI];
    },
    from(coordinates) {
      const x = coordinates[0];
      const y = Math.min(
        Math.max(coordinates[1], -WAGNER_6_U_LAT),
        +WAGNER_6_U_LAT
      );
      const t = y / 2;
      return [
        (x * Math.PI) / Math.sqrt(1 - 3 * t * t) / RADIANS,
        (y * Math.PI) / 2 / RADIANS,
      ];
    },
  };

  const customizeLayer = (elements) => {
    elements.forEach((element) => {
      const countryGDPData =
        mapData[capitalize(element.attribute("name"))] === undefined
          ? mapData[element.attribute("name")]
          : mapData[capitalize(element.attribute("name"))];
      element.attribute(
        "total",
        (countryGDPData && countryGDPData?.total) || 0
      );
    });
  };

  function capitalize(input) {
    let words = input?.split(" ");
    let CapitalizedWords = [];
    words?.forEach((element) => {
      CapitalizedWords.push(
        element[0].toUpperCase() +
          element.toLowerCase().slice(1, element.length)
      );
    });
    return CapitalizedWords.join(" ");
  }

  const TooltipTemplate = (info) => {
    const label =
      indicator === "Income per capita" ? "Income Per Capita" : "Population";
    let name = info.attribute("name")
      ? info.attribute("name")
      : info.attribute("CITY");
    let capitalToSmallName = capitalize(name);
    const countryGDPData =
      mapData[capitalToSmallName] !== undefined
        ? mapData[capitalToSmallName]
        : mapData[name];
    let total;
    total = countryGDPData && countryGDPData.total;

    const gdpInfo = total ? (
      <div id="nominal">
        {" "}
        {`${label}: ${total.toLocaleString().split(".")[0]}`}{" "}
      </div>
    ) : null;

    if (typeof countryGDPData === "undefined") {
      return <></>;
    }
    return (
      <div>
        <h4> {capitalToSmallName} </h4>
        {gdpInfo}
      </div>
    );
  };

  return (
    <div>
      {/* <Map
        bounds={mapBounds}
        controls={true}
        projection={customProjection}
        id="map-container"
      >
        <Test
          name="areas"
          palette={streamsPalette}
          dataSource={mapsData?.world}
          colorGroups={colorGroups2}
          colorGroupingField="total"
          customize={customizeLayer}
          label="enabled: true"
        >
          <Label dataField="name" enabled={true} />
        </Test>
        <Tip enabled={true} contentRender={TooltipTemplate} />
      </Map> */}

      <ResponsiveContainer width="50%" height={400}>
        <BarChart
          layout="vertical"
          data={populationChartData}
          margin={{
            top: 20,
            right: 10,
            left: 0,
            bottom: 20,
          }}
        >
          <XAxis
            type="number"
            interval={0}
            textAnchor="end"
            verticalAnchor="end"
            tickFormatter={(tick) => {
              return `${tick / 1000000}M`;
            }}
          />
          <YAxis
            type="category"
            dataKey="locality"
            axisLine={false}
            className="chart-label"
            tick={{ width: "55px" }}
          />
          <Tooltip
            separator=": "
            formatter={(tick) => {
              return `${(tick / 1000000).toFixed(0)}M`;
            }}
          />
          <Legend wrapperStyle={{ left: 30 }} />
          <Bar
            maxBarSize={100}
            dataKey="populations"
            name="Population"
            fill={"#C57"}
          />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width={"50%"} height={400}>
        <LineChart
          data={populationTime}
          margin={{
            top: 20,
            right: 10,
            left: 0,
            bottom: 20,
          }}
        >
          <XAxis
            dataKey="year"
            interval={0}
            textAnchor="end"
            sclaeToFit={true}
            verticalAnchor="start"
          />
          <YAxis
            className="chart-label"
            tickFormatter={(tick) => {
              return `${tick / 1000000}M`;
            }}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <ReferenceArea
            x1={2021}
            x2={[2010, 2031]}
            stroke="grey"
            strokeOpacity={0.3}
          />
          <Tooltip
            separator=": "
            formatter={(tick) => {
              return `${(tick / 1000000).toFixed(0)}M`;
            }}
          />
          <Legend wrapperStyle={{ left: 30 }} />
          {selectedCountry.map((entry, index) => (
            <Line
              dot={false}
              strokeWidth={2}
              key={index}
              dataKey={entry}
              name={`${entry?.replace("Base", "(Base)")}`}
              // ?.replace("Upside", "(Upside)")
              // ?.replace("Downside", "(Downside)")}`}
              stroke={COLORS[index % COLORS?.length]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <ComposedChart width={730} height={250} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#f5f5f5" />
        <Area type="monotone" dataKey="amt" fill="#0f0f0f" stroke="purple" />
        <Bar dataKey="pv" barSize={20} fill="#000" />
        <Line type="monotone" dataKey="uv" stroke="red" />
      </ComposedChart>
    </div>
  );
}

export default Recharts;
