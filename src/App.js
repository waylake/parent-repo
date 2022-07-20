import "./App.css";
import React from "react";
import Plot from "react-plotly.js";
// import * as data from "./Data";
import getInfo from "./DataExtraction";
import { visualization } from "./visualization";
// import Point from "./Point";
// import $ from "jquery";

// function runPy() {
//   $.ajax({
//     type: "POST",
//     url: "./test.py",
//     success: function (data) {
//       console.log(data);
//     },
//   });
// }


class App extends React.Component {
  render() {
    const dataJson = getInfo(
      "https://www.clinicaltrials.gov/ct2/show/NCT05442268?draw=2&rank=3"
    );
    console.log(dataJson);
    // runPy();


    return (
      visualization(dataJson)
    );
  }
}

export default App;
