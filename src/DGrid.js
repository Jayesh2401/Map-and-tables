import DataGrid, {
  Column,
  FilterRow,
  HeaderFilter,
  Selection,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import React from "react";
import { stockData } from "./DatGrid";
function DGrid() {
  const handleLimit = (data) => {
    let yearArr = [];
    data?.length > 0 &&
      data.map((d) => {
        if (d?.adjustment !== null) {
          yearArr.push(d?.year);
        }
        return "";
      });
    if (yearArr?.length > 0) {
      return `Yes, tapered increase in ${yearArr?.join(", ")?.toString()}`;
    } else {
      return "No";
    }
  };

  const handleSegment = (data) => {
    if (data?.length > 0) {
      if (data?.adjustment === null) {
        return `No`;
      } else {
        return `Yes ${data[0]?.price_segment}`;
      }
    } else {
      return `No`;
    }
  };
  return (
    <div>
      <DataGrid
        id="gridContainer"
        dataSource={stockData}
        keyExpr="user_scenario"
        showBorders={true}
      >
        <Selection mode="multiple" />
        <HeaderFilter visible={true} />
        <FilterRow visible={true} />
        <Column
          dataField="country"
          width={150}
          caption="Country"
          alignment="center"
          sortOrder="asc"
          // allowHeaderFiltering={false}
        ></Column>
        <Column dataField="category" width={180} caption="Category"></Column>
        <Column
          dataField="economic_outlook"
          width={150}
          caption="Economic Outlook"
        ></Column>
        <Column
          dataField="user_scenario"
          width={150}
          alignment="center"
          allowFiltering={false}
          caption="Scenario"
        ></Column>
        <Column
          dataField="time_series_method"
          allowFiltering={false}
          alignment="center"
          width={160}
          customizeText={(e) =>
            Object.keys(e.value[0]).toString().toUpperCase()
          }
          caption="Time series method"
        ></Column>
        <Column
          dataField="post_covid_recovery"
          allowFiltering={false}
          alignment="center"
          customizeText={(e) => (e.value[0].covid_recovery <= 0 ? "NO" : "YES")}
          width={150}
          caption="Post-covid recovery"
        ></Column>
        <Column
          dataField="growth_limiting"
          allowFiltering={false}
          customizeText={(e) => handleLimit(e.value)}
          caption="Growth limiting"
          width={250}
          alignment="center"
        ></Column>
        <Column
          dataField="category_level_pricing_adjustment"
          allowFiltering={false}
          caption="Category-level pricing adjustment"
          width={170}
          customizeText={(e) => (e.value === null ? "No" : "Yes")}
          alignment="center"
        ></Column>
        <Column
          dataField="segment_level_pricing_adjustment"
          allowFiltering={false}
          caption="Segment-level pricing adjustment"
          alignment="center"
          width={180}
          customizeText={(e) => handleSegment(e.value)}
        ></Column>
        <Column
          dataField="Category_model_driver_weights_adjustment.difference"
          allowFiltering={false}
          caption="Category-modal driver weights adjustment"
          alignment="center"
          width={280}
        ></Column>
        <Column
          dataField="S_curve_position_weights_adjustment.difference"
          allowFiltering={false}
          caption="S-curve positon weights adjustment"
          alignment="center"
          width={240}
        ></Column>

        <Column
          dataField="Aging_population_driver_share_of_momentum_adjustment.difference"
          allowFiltering={false}
          caption="Aging-population driver share of momentum adjustment"
          alignment="center"
          width={280}
        ></Column>
      </DataGrid>
    </div>
  );
}

export default DGrid;
