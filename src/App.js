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




function changeIdx(armGroupList, idx1, idx2) {
  const tempList = { ...armGroupList[idx1] };
  armGroupList[idx1] = armGroupList[idx2];
  armGroupList[idx2] = tempList;
}

function App() {

  const infoDict = require("./NCT_ID_database/NCT03507790.json");
  const dataJson = getInfo(infoDict);



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
  console.log(data);

  //branch
  const startX = data[0].x[1]; // 시작점
  const crossOverX = [data[0].x[0], startX, startX + armGArrowW / 3, startX + armGArrowW / 3 * 2, startX + armGArrowW];
  const parallelX = [data[0].x[0], startX, startX + armGArrowW];

  function modifyBranch(model, data, idx) {
    if (model === 'Crossover Assignment') {
      const startY1 = data[idx[0]].y[1];
      const startY2 = data[idx[1]].y[1];
      const y1 = [data[0].y[0], startY1, startY1, startY2, startY2];
      const y2 = [data[0].y[0], startY2, startY2, startY1, startY1];
      const y = [y1, y2];
      for (let i = 0; i < idx.length; i++) {
        data[idx[i]].x = crossOverX;
        data[idx[i]].y = y[i];
      }
    }
    const startY1 = data[idx[0]].y[1];
    const startY2 = data[idx[1]].y[1];
    const y1 = [data[0].y[0], startY1, startY1];
    const y2 = [data[0].y[0], startY2, startY2,];
    const y = [y1, y2];
    if (model === 'Parallel Assignment') {
      for (let i = 0; i < idx.length; i++) {
        data[idx[i]].x = parallelX;
        data[idx[i]].y = y[i];
      }
    }
  }

  let content = '';
  if (mode === 'READ') { //READ 모드일때 edit버튼을 누르면
    content =
      <Button icon={faPenToSquare} onChangeMode={() => {
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
        // data 클릭 되게 바꾸기
        const newData = [...data];
        for (let value of newData) {
          if (value.name) value.hoverinfo = 'none';
        }
        setData(newData);
        setLayout(newLayout);
        setMode('EDIT');
      }} ></Button>;
  }

  else if (mode === 'EDIT') {
    content = <>
      <Button icon={faGripLines} onChangeMode={() => {
        // crossover -> parallel 로 바꾸기
        const newInfoDict = { ...infoDict };
        const clickedBranchIdx = []; // 선택된 branch idx 2개 담기
        for (let i = 0; i < data.length; i++) {
          if (data[i].opacity === 0.3) clickedBranchIdx.push(i);
        }

        const newDataJson = getInfo(newInfoDict);
        const newVisualizationInfo = visualization(newDataJson);
        const newData = newVisualizationInfo.Gdata;
        const newLayout = newVisualizationInfo.Glayout;
        modifyBranch('Parallel Assignment', newData, clickedBranchIdx);
        for (let value of newData) {
          if (value.name) value.hoverinfo = 'none';
        }

        setData(newData);
        setLayout(newLayout);
      }}></Button>

      <Button icon={faShuffle} onChangeMode={() => {
        // parallel -> cross over로 바꾸기
        const newInfoDict = { ...infoDict };

        let clickedBranchIdx = []; // 선택된 branchidx 2개 담기
        for (let i = 0; i < data.length; i++) {
          if (data[i].opacity === 0.3) clickedBranchIdx.push(i);
        }

        //branch가 붙어있지 않다면 붙어있도록 순서 변경
        if (clickedBranchIdx[1] - clickedBranchIdx[0] !== Math.abs(1)) {
          const [smallIdx, bigIdx] = clickedBranchIdx[1] > clickedBranchIdx[0] ? clickedBranchIdx : [...clickedBranchIdx].reverse();
          const movingBranchIdx = smallIdx + 1; // 모양이 바뀌지 않지만 순서가 교체당할 branch idx
          const armGroupList = newInfoDict.DrugInformation.ArmGroupList;
          changeIdx(armGroupList, movingBranchIdx, bigIdx);
          clickedBranchIdx = [smallIdx, movingBranchIdx];
        }

        const newDataJson = getInfo(newInfoDict);
        const newVisualizationInfo = visualization(newDataJson);
        const newData = newVisualizationInfo.Gdata;
        const newLayout = newVisualizationInfo.Glayout;

        for (let value of newData) {
          if (value.name) value.hoverinfo = 'none';
        }

        //좌표 설정
        modifyBranch('Crossover Assignment', newData, clickedBranchIdx);
        setLayout(newLayout);
        setData(newData);
      }}></Button>

      <Button icon={faFloppyDisk} onChangeMode={() => {
        // editable: false
        //여기서는 datajson을 바꿔줘야함
        const newConfig = { ...config };
        newConfig.edits.annotationText = false;
        setConfig(newConfig);

        //편집 완료시 태그 다시 추가 및 박스 크기와 위치 조절
        const newInfoDict = { ...infoDict };
        const annot = layout.annotations;
        for (let i = 0; i < annot.length; i++) { // text 정제 작업
          if (annot[i].name?.type === 'PopulationBox') { //population
            const idx = annot[i].text.indexOf(':');
            annot[i].text = annot[i].text.substring(idx + 2);
            newInfoDict.PopulationBox[annot[i].name.inJson] = annot[i].text;
          }
          // intervention
          else if (annot[i].name?.type === 'intervention') {
            if (annot[i].text === 'write text') annot[i].text = '';// write text라 써져있으면 다시 지우기
            newInfoDict[annot[i].name.inJson] = annot[i].text;
          }
          // armGroup
          else if (annot[i].name?.type === 'armGroup') {
            if (annot[i].text === 'write text') annot[i].text = ''; // write text라 써져있으면 지우기

            if (annot[i].name.inJson === 'Duration') {
              newInfoDict.DrugInformation.ArmGroupList[annot[i].name.idx].InterventionDescription[0].Duration = annot[i].text;
            }
            else if (annot[i].name.inJson === 'DrugName') {
              let t = 0;
              while (annot[i].text.includes('+')) { // + 로 찾아
                let idx = annot[i].text.indexOf('+');
                newInfoDict.DrugInformation.ArmGroupList[annot[i].name.idx].InterventionDescription[t].DrugName = annot[i].text.substring(0, idx);//다시 약물 한개씩 쪼개서 집어 넣기
                t++
                annot[i].text = annot[i].text.substring(idx + 1); // 앞에 것 지우기
              }
              newInfoDict.DrugInformation.ArmGroupList[annot[i].name.idx].InterventionDescription[t].DrugName = annot[i].text; // 맨 마지막 것 추가
            }
          }
          const newDataJson = getInfo(newInfoDict);
          const newVisualizationInfo = visualization(newDataJson);

          for (let i = 3; i < layout.shapes.length; i++) {
            newVisualizationInfo.Glayout.shapes[i] = layout.shapes[i];
          }
          setLayout(newVisualizationInfo.Glayout);
          // data 클릭 안되게 바꾸기
          const newData = [...data];
          for (let value of newData) {
            if (value.name) value.hoverinfo = 'skip';
          }
          setData(newData);
          setMode('READ');
        }
      }}>
      </Button>
    </>;
  }

  return (
    <div className="container">
      <div className="url">
        <Search className></Search>
      </div>
      <div className="plot">
        <Plot

          layout={layout}
          data={data}
          frames={frames}
          config={config}

          onClick={(e) => {

            const newLayout = { ...layout };
            let selectedBranch = 0;
            //branch 투명도
            e.points[0].data.opacity = e.points[0].data.opacity === 1 ? 0.3 : 1;
            //화살표 촉 투명도
            for (let value of newLayout.shapes) {
              if (value.name && value.name[0] === 'arrow' && value.name[1] === e.points[0].data.name[1]) {
                value.opacity = value.opacity === 1 ? 0.3 : 1;
              }
            }

            for (let value of data) { //클릭된 개수 세기
              selectedBranch = value.opacity === 0.3 ? selectedBranch + 1 : selectedBranch;
            }
            if (selectedBranch >= 3) {
              //branch 투명도
              alert('두개 까지만 선택 가능합니다.');
              e.points[0].data.opacity = 1;
              //화살표 촉 투명도
              for (let value of newLayout.shapes) {
                if (value.name && value.name[0] === 'arrow' && value.name[1] === e.points[0].data.name[1]) {
                  value.opacity = 1;
                }
              }
            }
            const newData = [...data];
            setData(newData);
            setLayout(newLayout);

          }}
        // onInitialized={(figure) => useState(figure)}
        // onUpdate={(figure) => useState(figure)}
        >
        </Plot>
        <div className="buttonDiv">
          {content}
        </div>
      </div>
    </div>
  );
}

export default App;
