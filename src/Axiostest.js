import axios from "axios";
import React, { useEffect, useState } from "react";

function Axiostest() {
  const [data, setData] = useState({});

  axios.interceptors.request.use(
    (config) => {
      // perform a task before the request is sent
    //   console.log("Request was sent");

      return config;
    },
    (error) => {
      // handle the error
      return Promise.reject(error);
    }
  );

  const fecthApi = () => {
    // axios.get("http://webcode.me").then((resp) => {
    // //   console.log(resp);
    // });

    axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      //   .then((response) => response.json())
      .then((json) => setData(json.data));
  };

  // sent a GET request
//   axios.get("https://api.github.com/users/mapbox").then((response) => {
//     // console.log(response.data.created_at);
//   });

  axios.interceptors.request.use(
    (res) => {
      console.log(res);
      return res;
    },
    (err) => {
      console.log(err);
      if (data.status === 200) {
        alert("FWFvsevsdv");
      }
    }
  );

 
  console.log(data, "esvbads");

  useEffect(() => {
    fecthApi();
  }, []);

  return <div>https://jsonplaceholder.typicode.com/todos/1 {data.chartName}</div>;
}

export default Axiostest;
