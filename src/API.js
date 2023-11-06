import React, { useEffect, useState } from "react";

function API() {
  const [color, setColors] = useState({
    bg: "",
    fc: "",
  });
  const texts = ["white", "red", "blue", "yellow", "green"];
  const options = texts.map((text, index) => {
    return <option key={index}>{text}</option>;
  });
  const colors = ["black", "red", "blue", "yellow", "green"];
  const optionsColor = colors.map((color, indexColor) => {
    return <option key={indexColor}>{color}</option>;
  });
  let data = {};
  const api = () => {
    fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then((pro) => pro.json())
      .then((res) => data == res);
  };

  useEffect(() => {
    api();
  }, []);

   // const handleChange = (event) => {
  //   const input = event.target.value;
  //   const numbers = input.match(/\d+/g);
  //   if (numbers && numbers.length > 0) {
  //     console.log(numbers)
  //   } else {
  //     console.log(numbers,"number")
  //   }
  // };

  return (
    <div>
      <div style={{backgroundColor:color.bg , color:color.fc}}>
        <select
          onChange={(e) =>
            setColors((prev) => ({ ...prev, fc: e.target.value }))
          }
        >
          {options}
        </select>
        <select
          onChange={(e) =>
            setColors((prev) => ({ ...prev, bg: e.target.value }))
          }
        >
          {optionsColor}
        </select>
        <p >your font: {color.fc}</p>
        <p >your choice: {color.bg}</p>
      </div>
    </div>
  );
}

export default API;
