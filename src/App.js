import "./App.css";
import React from "react";
import Plot from "react-plotly.js";
// import * as data from "./Data";
import getInfo from "./DataExtraction";
import { visualization } from "./visualization";
// import Point from "./Point";
// import $ from "jquery";


class App extends React.Component {
  constructor(props) {
    super(props);

    let dataJson = getInfo(
      "put url in this area"
    );
    let visualizationInfo = visualization(dataJson);

    //Layout
    let vLayout = visualizationInfo.Glayout;
    let shapes = vLayout.shapes;
    let annotations = vLayout.annotations;
    let width = 800;
    let height = 800;
    
    this.state = { data: [], layout: {
      width,
      height,
      shapes,
      annotations,
      xaxis: { range: [9, 20] },
      yaxis: { range: [9, 15] },
    }, frames: [], config: {} };
    console.log(this.state);
  }

  render() {
    return (
      <Plot
        data={this.state.data}
        layout={this.state.layout}
        frames={this.state.frames}
        config={this.state.config}
        onInitialized={(figure) => this.setState(figure)}
        onUpdate={(figure) => this.setState(figure)}
      />
    );
  }
}

export default App;
