import "./App.css";
import React from "react";
import Plot from "react-plotly.js";
//컴포넌트
import Button from './component/Button'
import Search from './component/Search'
//함수
import { getInfo } from "./visualization/DataExtraction";
import { visualization } from "./visualization/visualization";
import { armGArrowW } from "./visualization/visualization";
import { armColorDict } from "./visualization/drawBranch";
//state
import { useState } from 'react';
//아이콘
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
// import {PythonShell} from 'python-shell';
import { faGripLines, faPray } from "@fortawesome/free-solid-svg-icons";
import { faShuffle } from "@fortawesome/free-solid-svg-icons";


// import $ from "jquery";

function App() {
  const dataJson = getInfo("put url in this area");

  let visualizationInfo = visualization(dataJson);
  //data
  let vData = visualizationInfo.Gdata;

  //Layout
  let vLayout = visualizationInfo.Glayout;
  let vConfig = visualizationInfo.Gconfig;

  const [data, setData] = useState(vData);
  const [layout, setLayout] = useState(vLayout);
  const [frames, setFrames] = useState([]);
  const [config, setConfig] = useState(vConfig);

  const [mode, setMode] = useState('READ');
  let content = '';
  if (mode === 'READ') { //READ 모드일때 edit버튼을 누르면
    content =
      <Button icon={faPenToSquare} className='edit' onChangeMode={() => {


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
          if (annot[i].text === '') { // 빈 텍스트 값이면
            annot[i].text = 'write text';
            annot[i].bordercolor = '#c7c7c7';
          }
          else { // 빈 텍스트 값이 아니면
            annot[i].text = annot[i].text.replace(re1, ' ');
            annot[i].text = annot[i].text.replace(re2, '');
          }
        }
        setLayout(newLayout);
        setMode('EDIT');
      }} ></Button>;
  }

  else if (mode === 'EDIT') {//여기서는 datajson을 바꿔줘야함
    content = <>
      <Button icon={faFloppyDisk} className='edit' onChangeMode={() => {
        // editable: false
        const newConfig = { ...config };
        newConfig.edits.annotationText = false;
        setConfig(newConfig);

        //편집 완료시 태그 다시 추가 및 박스 크기와 위치 조절

        const annot = layout.annotations;
        let k = 0; //drugname세기
        let j = 0; //duration세기
        for (let i = 0; i < annot.length; i++) { // text 정제 작업
          if (annot[i].name[0] === 'population') { //population
            const idx = annot[i].text.indexOf(':');
            annot[i].text = annot[i].text.substring(idx + 2);
            dataJson.population[annot[i].name[1]] = annot[i].text;
          }
          else if (annot[i].name[0] === 'infoTrial') {
            const completeTimeIdx = annot[i].text.indexOf(' ');
            const idx = annot[i].text.indexOf(':');
            annot[i].text = annot[i].name[1] === 'completeTime' ? annot[i].text.substring(0, completeTimeIdx + 1) : annot[i].text.substring(idx + 2);
            dataJson.infoTrial[annot[i].name[1]] = annot[i].text;
          }
          // intervention
          else if (annot[i].name[0] === 'intervention') {
            if (annot[i].name[1] === 'masking') annot[i].text = annot[i].text.replace('M=', '');
            else if (annot[i].name[1] === 'enrollment') annot[i].text = annot[i].text.replace('N=', '');
            if (annot[i].text === 'write text') annot[i].text = '';// write text라 써져있으면 다시 지우기
            dataJson.intervention[annot[i].name[1]] = annot[i].text;
          }
          // armGroup
          else if (annot[i].name[0] === 'armGroup') {
            if (annot[i].text === 'write text') annot[i].text = ''; // write text라 써져있으면 지우기
            if (annot[i].name[1] === 'Duration') {
              dataJson.armGroup.interventionDescription[j++][0]['Duration'] = annot[i].text;
            }
            else if (annot[i].name[1] === 'DrugName') {
              if (dataJson.designModel === 'Crossover Assignment') {
                let t = 0;
                while (annot[i].text.includes('+')) {
                  let idx = annot[i].text.indexOf('+');
                  dataJson.armGroup.interventionDescription[k][t]['DrugName'] = annot[i].text.substring(0, idx);
                  t++
                  annot[i].text = annot[i].text.substring(idx + 1);
                }
                dataJson.armGroup.interventionDescription[k][t]['DrugName'] = annot[i].text;
                i++;
                k++;
              }
              else {
                let t = 0;
                while (annot[i].text.includes('+')) { // + 로 찾아
                  let idx = annot[i].text.indexOf('+');
                  dataJson.armGroup.interventionDescription[k][t]['DrugName'] = annot[i].text.substring(0, idx);//다시 약물 한개씩 쪼개서 집어 넣기
                  t++
                  annot[i].text = annot[i].text.substring(idx + 1); // 앞에 것 지우기
                }
                dataJson.armGroup.interventionDescription[k][t]['DrugName'] = annot[i].text; // 맨 마지막 것 추가
                k++;
              }
            }
          }

          const newVisualizationInfo = visualization(dataJson);
          for (let i = 3; i < layout.shapes.length; i++) {
            newVisualizationInfo.Glayout.shapes[i] = layout.shapes[i];
          }
          setLayout(newVisualizationInfo.Glayout);
          setMode('READ');
        }
      }}>
      </Button>

      <Button icon={faGripLines} className='parallel' onChangeMode={() => {
        // crossover -> parallel 로 바꾸기
        const newData = [...data];
        const newLayout = { ...layout };
        const clickedBranchIdx = []; // 선택된 branch 담기
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].opacity === 0.3) clickedBranchIdx.push(i);
        }
        const startX = newData[0].x[1]; // 시작점
        const x = [newData[0].x[0], startX, startX + armGArrowW];
        const startY1 = newData[clickedBranchIdx[0]].y[1];
        const startY2 = newData[clickedBranchIdx[1]].y[1];
        const y1 = [newData[0].y[0], startY1, startY1];
        const y2 = [newData[0].y[0], startY2, startY2,];
        const y = [y1, y2];

        //좌표 설정
        for (let i = 0; i < clickedBranchIdx.length; i++) {
          newData[clickedBranchIdx[i]].x = x;
          newData[clickedBranchIdx[i]].y = y[i];
          newData[clickedBranchIdx[i]].opacity = 1;
        }

        //화살표촉 색깔 바꾸기
        for (let i = 0; i < 2; i++) {
          for (let value of newLayout.shapes) {
            if (value.name && value.name[0] === 'arrow' && value.name[1] === clickedBranchIdx[i]) {
              value.fillcolor = armColorDict[newData[clickedBranchIdx[i]].name]; // 채우기 색깔
              value.line.color = armColorDict[newData[clickedBranchIdx[i]].name]; // 테두리 색깔
            }
          }
        }
        setData(newData);
        setLayout(newLayout);
      }}></Button>

      <Button icon={faShuffle} className='crossover' onChangeMode={() => {
        // parallel -> cross over로 바꾸기
        const newData = [...data];
        const newLayout = { ...layout };
        const clickedBranchIdx = []; // 선택된 branch 담기
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].opacity === 0.3) clickedBranchIdx.push(i);
        }
        //branch가 붙어있지 않다면 붙어있도록 순서 변경

        //branch 꼬기
        const startX = newData[0].x[1]; // 시작점
        const armGArrowW = newData[0].x[2] - newData[0].x[1]; // 화살표 전체 x증가량
        const x = [newData[0].x[0], startX, startX + armGArrowW / 3, startX + armGArrowW / 3 * 2, startX + armGArrowW];
        const startY1 = newData[clickedBranchIdx[0]].y[1];
        const startY2 = newData[clickedBranchIdx[1]].y[1];
        const y1 = [newData[0].y[0], startY1, startY1, startY2, startY2];
        const y2 = [newData[0].y[0], startY2, startY2, startY1, startY1];
        const y = [y1, y2];

        //좌표 설정
        for (let i = 0; i < clickedBranchIdx.length; i++) {
          newData[clickedBranchIdx[i]].x = x;
          newData[clickedBranchIdx[i]].y = y[i];
          newData[clickedBranchIdx[i]].opacity = 1;
        }

        //화살표촉 색깔 바꾸기
        for (let i = 0; i < 2; i++) {
          for (let value of newLayout.shapes) {
            if (value.name && value.name[0] === 'arrow' && value.name[1] === clickedBranchIdx[i]) {
              value.fillcolor = armColorDict[newData[clickedBranchIdx[1 - i]].name]; // 채우기 색깔
              value.line.color = armColorDict[newData[clickedBranchIdx[1 - i]].name]; // 테두리 색깔
            }
          }
        }
        setData(newData);
        setLayout(newLayout);
      }}></Button>
    </>;
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

        onClick={(e) => {
          e.points[0].data.opacity = 0.3;
          const newData = [...data];
          setData(newData);
        }}
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
