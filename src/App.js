import "./App.css";
import React from "react";
import Plot from "react-plotly.js";
import { getInfo } from "./visualization/DataExtraction";
import { visualization } from "./visualization/visualization";
import { countLine } from "./visualization/drawPopulation";
import { useState } from 'react';

// import $ from "jquery";

function Button(props) {
  return <input className="button" type="button" value={props.click} onClick={e => {
    e.preventDefault();
    props.onChangeMode();
  }}></input>
}

function Search() {
  return <div>
    <input type="text" placeholder="URL 입력" name="url"></input>
    <button type="submit">모식도 생성</button>
  </div>
}


function App() {
  let dataJson = getInfo("put url in this area");
  let visualizationInfo = visualization(dataJson);

  //data
  let vData = visualizationInfo.Gdata;

  //Layout
  let vLayout = visualizationInfo.Glayout;
  let shapes = vLayout.shapes;
  let annotations = vLayout.annotations;
  let width = 800;
  let height = 800;


  // const icon1 = {
  //   width: 500,
  //   height: 600,
  //   path: 'M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z'
  // }


  const [data, setData] = useState(vData);
  const [layout, setLayout] = useState({
    width,
    height,
    // autosize: true,
    annotations,
    shapes,
    xaxis: {
      range: [9, 29],
      showgrid: false,
      showticklabels: false,
    },
    yaxis: {
      range: [9, 11],
      showgrid: false,
      showticklabels: false,
    },
    // legend position
    legend: {
      x: 0.04, //x: -2~3
      y: 0.44, //y: -2~3
      font: {
        size: 9,
      }
    }
  });
  const [frames, setFrames] = useState([]);
  const [config, setConfig] = useState({
    edits: {
      annotationText: false,
    },
    modeBarButtonsToAdd: [],
    modeBarButtonsToRemove: ['zoomIn2d', 'zoomOut2d', 'zoom2d'],
    displayModeBar: true,
  });
  // var Plotly = require("plotly.js/lib/core");
  // Plotly.setPlotConfig({
  //   modeBarButtonsToAdd: [{
  //     name: 'text edit',
  //     icon: icon1,
  //   }],
  //   modeBarButtonsToRemove: ['zoomIn2d', 'zoomOut2d', 'zoom2d'],
  // });
  // module.exports = Plotly;
  const [mode, setMode] = useState('READ');

  let content = '';
  if (mode === 'READ') { //READ 모드일때 edit버튼
    content = <Button click='E' onChangeMode={() => {
      // editable하게 바꾸기
      const newConfig = { ...config };
      newConfig.edits.annotationText = true;
      // newConfig.modeBarButtonsToAdd.push({
      //   name: 'text edit',
      //   icon: icon1,
      // });
      setConfig(newConfig);

      // Layout값 바꾸기
      const newLayout = { ...layout };
      const annot = newLayout.annotations;
      const re1 = /<br>/g; //br태그 정규표현식
      const re2 = /<\/?b>/g; //b태그 정규표현식
      for (let i = 0; i < annot.length; i++) {
        annot[i].text = annot[i].text.replace(re1, ' ');
        annot[i].text = annot[i].text.replace(re2, '');
      }
      setLayout(newLayout);
      setMode('EDIT');
    }} ></Button>;
  }

  else if (mode === 'EDIT') {
    content = <Button click='S' onChangeMode={() => {
      // editable: false
      const newConfig = { ...config };
      newConfig.edits.annotationText = false;
      setConfig(newConfig);

      //br태그 추가
      const newLayout = { ...layout };
      const annot = newLayout.annotations;
      for (let i = 0; i < annot.length; i++) {
        if (annot[i].name === 'population') {
          const idx = annot[i].text.indexOf(':');
          const front = annot[i].text.substring(0, idx + 1);
          const back = annot[i].text.substring(idx + 1);
          annot[i].text = `<b>${front}</b>${back}`;
          if (i === 0) annot[i].text = countLine(annot[i].text, 20)[1];
        }
        else {
          annot[i].text = countLine(annot[i].text, 70)[1];
        }
      }
      setLayout(newLayout);
      setMode('READ');
    }}>
    </Button>
  }

  return (
    <div className="container">
      <div className="url">
        <Search className></Search>
      </div>
      <Plot
        className="plot"
        layout={layout}
        data={data}
        frames={frames}
        config={config}
      // onInitialized={(figure) => useState(figure)}
      // onUpdate={(figure) => useState(figure)}
      />

      <div className="buttonDiv">
        {content}
      </div>
    </div>
  );
}

export default App;
