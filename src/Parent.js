import React from "react";
import TestData from "./TestData";
import DGrid from "./DGrid";
import Maps from "./Map";
import OptimisedSegment from "./OptimisedSegment";
import DevextremeMap from "./DevextremeMap";
import Recharts from "./Recharts";
import Allset from "./Allset";
import Test from "./Test";
import Filter from "./Filter";

function Parent() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Multile packages and demo</h1>

      <h2 style={{ marginTop: "20px" }}>1. Devextreme-react/data-grid </h2>
      <TestData />
      <h2 style={{ marginTop: "20px", marginBottom: "20px" }}>
        2. Devextreme-react/data-grid with some country data filtering{" "}
      </h2>
      <DGrid />
      <h2 style={{ marginTop: "20px", marginBottom: "20px" }}>
        3. Devextreme-react vector-map with some country data filtering{" "}
      </h2>
      <Maps />
      <h2 style={{ marginTop: "20px", marginBottom: "20px" }}>
        4. Simple demo for updating multiple inputs{" "}
      </h2>
      <OptimisedSegment />
      <h2 style={{ marginTop: "20px", marginBottom: "20px" }}>
        5. Devextreme-react world-map
      </h2>
      <DevextremeMap />
      <h2 style={{ marginTop: "20px", marginBottom: "20px" }}>
        6. Different various ReCharts list
      </h2>
      <Recharts />
      <h2 style={{ marginTop: "20px", marginBottom: "20px" }}>
        7. Country listing custom
      </h2>
      <Allset />
      <h2 style={{ marginTop: "20px", marginBottom: "20px" }}>
        8. Country listing custom with Dangerous-HTML
      </h2>
      <Test />
      <h2 style={{ marginTop: "20px", marginBottom: "20px" }}>
        9. Country listing custom without Dangerous-HTML (custom)
      </h2>
      <Filter />
    </div>
  );
}

export default Parent;
