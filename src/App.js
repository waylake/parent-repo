import "./App.css";
import React from "react";
import Plot from "react-plotly.js";
//컴포넌트
import Button from './component/Button'
import Search from './component/Search'
//함수
import { getInfo } from "./visualization/DataExtraction";
import { visualization } from "./visualization/visualization";
//state
import { useState } from 'react';
//아이콘
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";


// import $ from "jquery";


function App() {
  const dataJson = getInfo("put url in this area");
  let visualizationInfo = visualization(dataJson);
  //data
  let vData = visualizationInfo.Gdata;

  //Layout
  let vLayout = visualizationInfo.Glayout;

  const [data, setData] = useState(vData);
  const [layout, setLayout] = useState({
    width: 800,
    height: 800,
    // autosize: true,
    annotations: vLayout.annotations,
    shapes: vLayout.shapes,
    xaxis: {
      range: [9, 29],
      // showgrid: false,
      // showticklabels: false,
    },
    yaxis: {
      range: [9, 11],
      // showgrid: false,
      // showticklabels: false,
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
    scrollZoom: true,
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
    content = <Button icon={faFloppyDisk} onChangeMode={() => {
      // editable: false
      const newConfig = { ...config };
      newConfig.edits.annotationText = false;
      setConfig(newConfig);

      //편집 완료시 태그 다시 추가 및 박스 크기와 위치 조절
      const newLayout = { ...layout };
      const annot = newLayout.annotations;
      const populationList = [];
      const infoTrialList = [];

      for (let i = 0; i < annot.length; i++) {
        const idx = annot[i].text.indexOf(':');
        annot[i].text = annot[i].text.substring(idx + 2);
        if (typeof annot[i].name === 'object' && annot[i].name[0] === 'population') {
          populationList.push(annot[i]);
        }
        else if (typeof annot[i].name === 'object' && annot[i].name[0] === 'infoTrial') {
          infoTrialList.push(annot[i]);
        }
      }
      for (let i = 0; i < populationList.length; i++) {
        for (let key in dataJson.population) {
          if (key === populationList[i].name[1]) {
            dataJson.population[key] = populationList[i].text;
          }
        }
      }
      for (let i = 0; i < infoTrialList.length; i++) {
        for (let key in dataJson.infoTrial) {
          if (key === infoTrialList[i].name[1]) {
            dataJson.infoTrial[key] = infoTrialList[i].text;
          }
        }
      }

      const newVisualizationInfo = visualization(dataJson);
      newLayout.annotations = newVisualizationInfo.Glayout.annotations;
      newLayout.shapes = newVisualizationInfo.Glayout.shapes;
      setLayout(newLayout);
      setData(newVisualizationInfo.Gdata);
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
