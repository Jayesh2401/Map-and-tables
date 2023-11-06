import React from 'react'
import Data from "./Check.json";

function Sirji() {
    var cars = Data,
    result = cars.reduce(function (r, a) {
        r[a.year] = r[a.year] || [];
        r[a.year].push(a);
        return r;
    }, Object.create(null));

  return (
    <div>Sirji</div>
  )
}

export default Sirji