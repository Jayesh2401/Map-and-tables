import React, { useState } from "react";
import Data from "./Check.json";

function Segment() {
  let array = [];
  Data.map((data) =>
    array.some(function (ele) {
      return ele.year === data.year;
    })
      ? (array = array.map((ele) =>
          ele.year === data.year
            ? {
                ...ele,
                [data.price_segment]: data.adjustment,
              }
            : ele
        ))
      : (array = [
          ...array,
          {
            year: data.year,
            [data.price_segment]: data.adjustment,
          },
        ])
  );
  console.log(array);
  return <div>Segment</div>;
}

export default Segment;
