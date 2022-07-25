import "./App.css";
import React from "react";
import Plot from "react-plotly.js";
import getInfo from "./DataExtraction";
import { visualization } from "./visualization";
// import $ from "jquery";

class App extends React.Component {
  constructor(props) {
    super(props);

    let dataJson = getInfo("put url in this area");
    let visualizationInfo = visualization(dataJson);

    //data
    let vData = visualizationInfo.Gdata;

    //Layout
    let vLayout = visualizationInfo.Glayout;
    let shapes = vLayout.shapes;
    let width = 800;
    let height = 800;

    this.state = {
      data: vData,
      layout: {
        width,
        height,
        shapes,
        xaxis: { range: [9, 27], showgrid: false, showticklabels: false },
        yaxis: { range: [9, 11.5], showgrid: false, showticklabels: false },
      },
      frames: [],
      config: { editable: true },
    };

    console.log(this.state);
    ////////////////////////////////
  }

  render() {
    return (
      <Plot
        layout={this.state.layout}
        data={this.state.data}
        frames={this.state.frames}
        config={this.state.config}
        onInitialized={(figure) => this.setState(figure)}
        onUpdate={(figure) => this.setState(figure)}
      />
    );
  }
}

export default App;
