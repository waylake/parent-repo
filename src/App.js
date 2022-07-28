import "./App.css";
import React from "react";
import Plot from "react-plotly.js";
//컴포넌트
import Button from './component/Button'
import Search from './component/Search'
//함수
import { getInfo } from "./visualization/DataExtraction";
import { visualization } from "./visualization/visualization";
import { countLine } from "./visualization/drawPopulation";
//state
import { useState } from 'react';
//아이콘
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";


// import $ from "jquery";


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
    // modeBarButtonsToAdd: ['sendDataToCloud'],
    modeBarButtonsToRemove: ['zoomIn2d', 'zoomOut2d', 'zoom2d', 'autoScale2d',],
    displayModeBar: true,
  });

  const [mode, setMode] = useState('READ');

  let content = '';
  if (mode === 'READ') { //READ 모드일때 edit버튼
    content = <Button icon={faPenToSquare} onChangeMode={() => {
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
      console.log(annot);
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
    content = <Button icon={faFloppyDisk} onChangeMode={() => {
      // editable: false
      const newConfig = { ...config };
      newConfig.edits.annotationText = false;
      setConfig(newConfig);

      //br태그 추가
      const newLayout = { ...layout };
      const annot = newLayout.annotations;
      console.log(annot);
      annot[0].text = countLine(annot[0].text, 20)[1];
      for (let i = 1; i < annot.length; i++) {
        if (annot[i].name === 'population') {
          const idx = annot[i].text.indexOf(':');
          const front = annot[i].text.substring(0, idx + 1);
          const back = annot[i].text.substring(idx + 1);
          annot[i].text = `<b>${front}</b>${back}`;
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
