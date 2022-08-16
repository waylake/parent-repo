import "./App.css";
import React, { useEffect } from "react";
import Plot from "react-plotly.js";
// import "bootstrap/dist/css/bootstrap.min.css"; // bootstrap
import { Grid, Card } from "@mui/material/"; // material ui
//컴포넌트
import Button from "./component/Button";
import Search from "./component/Search";
//함수
import { getInfo } from "./visualization/DataExtraction";
import { visualization } from "./visualization/visualization";
import { changeInfoDict } from "./visualization/edit";
import { moveIdxFront } from "./visualization/edit";
import { removeHtmlTag } from "./visualization/edit";
import { makeNewModel } from "./visualization/edit";
//state
import { useState } from "react";
//아이콘
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import { faGripLines, faPray } from "@fortawesome/free-solid-svg-icons";
import { faShuffle } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
// import {getData} from './visualization/getJson';
//img
import armLabel from "./img/label.png";

function App() {
  const [infoDict, setInfoDict] = useState(
    require("./NCT_ID_database/NCT00482833.json")
  );

  // crossover : NCT04450953
  // 군 엄청 많아: NCT04844424
  // 약 엄청 많아: NCT02374567
  const [data, setData] = useState();
  const [layout, setLayout] = useState();
  const [frames, setFrames] = useState([]);
  const [config, setConfig] = useState();
  const [mode, setMode] = useState("READ");

  //Layout
  let vLayout, vConfig;
  let vData;

  useEffect(() => {
    (async () => {
      vData = await getInfo();
      let visualizationInfo = visualization(vData);

      //data
      setData(visualizationInfo.Gdata);
      setLayout(visualizationInfo.Glayout);
      setConfig(visualizationInfo.Gconfig);
    })();
  }, []);

  const clikckBranch = (e) => {
    const newLayout = { ...layout };
    let selectedBranch = 0;
    //branch 투명도
    e.points[0].data.opacity = e.points[0].data.opacity === 1 ? 0.3 : 1;
    //화살표 촉 투명도
    for (let value of newLayout.shapes) {
      if (
        value.name &&
        value.name.shape === "arrow" &&
        value.name.idx === e.points[0].data.name.idx
      ) {
        value.opacity = value.opacity === 1 ? 0.3 : 1;
      }
    }
    for (let value of data) {
      //클릭된 개수 세기
      selectedBranch =
        value.opacity === 0.3 ? selectedBranch + 1 : selectedBranch;
    }
    if (selectedBranch >= 3) {
      //branch 투명도
      alert("두개 까지만 선택 가능합니다.");
      e.points[0].data.opacity = 1;
      //화살표 촉 투명도
      for (let value of newLayout.shapes) {
        if (
          value.name &&
          value.name[0] === "arrow" &&
          value.name[1] === e.points[0].data.name[1]
        ) {
          value.opacity = 1;
        }
      }
    }
    const newData = [...data];
    setData(newData);
    setLayout(newLayout);
  };

  let content = "";
  if (mode === "READ") {
    //READ 모드일때 edit버튼을 누르면
    content = (
      <Button
        mode="edit"
        icon={faPenToSquare}
        onChangeMode={() => {
          // editable하게 바꾸기
          const newConfig = { ...config };
          newConfig.edits.annotationText = true;
          setConfig(newConfig);

          // Layout값 바꾸기
          const newLayout = { ...layout };
          const annot = newLayout.annotations;
          //Html tag 제거
          removeHtmlTag(annot);

          // data 클릭 되게 바꾸기
          const newData = [...data];
          for (let value of newData) {
            if (value.name) value.hoverinfo = "none";
          }
          setData(newData);
          setLayout(newLayout);
          setMode("EDIT");
        }}
      ></Button>
    );
  } else if (mode === "EDIT") {
    content = (
      <>
        <Button
          mode="parallel"
          icon={faGripLines}
          onChangeMode={() => {
            // crossover -> parallel 로 바꾸기
            const newInfoDict = { ...infoDict };
            const clickedBranchIdx = []; // 선택된 branch idx 2개 담기
            for (let i = 0; i < data.length; i++) {
              if (data[i].opacity === 0.3) clickedBranchIdx.push(i);
            }
            const armGroupList = newInfoDict.DrugInformation.ArmGroupList;
            newInfoDict.DesignModel = makeNewModel(
              newInfoDict.DesignModel,
              armGroupList.length,
              "-"
            );

            const annot = layout.annotations;
            changeInfoDict(newInfoDict, annot);
            const newDataJson = getInfo(newInfoDict);
            const newVisualizationInfo = visualization(newDataJson);
            const newData = newVisualizationInfo.Gdata;
            const newLayout = newVisualizationInfo.Glayout;

            for (let value of newData) {
              if (value.name) value.hoverinfo = "none";
            }
            removeHtmlTag(newLayout.annotations);
            setInfoDict(newInfoDict);
            setData(newData);
            setLayout(newLayout);
          }}
        ></Button>

        <Button
          mode="cross"
          icon={faShuffle}
          onChangeMode={() => {
            // parallel -> cross over로 바꾸기
            const newInfoDict = { ...infoDict };
            let clickedBranchIdx = []; // 선택된 branchidx 2개 담기
            for (let i = 0; i < data.length; i++) {
              if (data[i].opacity === 0.3) clickedBranchIdx.push(i);
            }

            //branch가 붙어있지 않다면 붙어있도록 순서 변경
            let [smallIdx, bigIdx] =
              clickedBranchIdx[1] > clickedBranchIdx[0]
                ? clickedBranchIdx
                : [...clickedBranchIdx].reverse();
            const armGroupList = newInfoDict.DrugInformation.ArmGroupList;
            //cross-over로 꼬을 브랜치 맨 앞으로
            moveIdxFront(armGroupList, [smallIdx, bigIdx]);
            newInfoDict.DesignModel = makeNewModel(
              newInfoDict.DesignModel,
              armGroupList.length,
              "+"
            );

            const annot = layout.annotations;
            changeInfoDict(newInfoDict, annot);

            const newDataJson = getInfo(newInfoDict);
            const newVisualizationInfo = visualization(newDataJson);
            const newData = newVisualizationInfo.Gdata;
            const newLayout = newVisualizationInfo.Glayout;

            for (let value of newData) {
              if (value.name) value.hoverinfo = "none";
            }
            //Html tag 제거
            removeHtmlTag(newLayout.annotations);
            setInfoDict(newInfoDict);
            setLayout(newLayout);
            setData(newData);
          }}
        ></Button>

        <Button
          mode="save"
          icon={faFloppyDisk}
          onChangeMode={() => {
            // editable: false
            const newConfig = { ...config };
            newConfig.edits.annotationText = false;
            setConfig(newConfig);

            //편집 완료시 태그 다시 추가 및 박스 크기와 위치 조절
            const newInfoDict = { ...infoDict };
            const annot = layout.annotations;
            changeInfoDict(newInfoDict, annot);

            const newDataJson = getInfo(newInfoDict);
            const newVisualizationInfo = visualization(newDataJson);

            setLayout(newVisualizationInfo.Glayout);
            setData(newVisualizationInfo.Gdata);
            setInfoDict(newInfoDict);
            setMode("READ");
          }}
        ></Button>
      </>
    );
  }
  return (
    <div className="container">
      <div className="url">
        <Search
          onCreate={(nctId) => {
            setInfoDict(require(`./NCT_ID_database/${nctId}.json`));
            setData(vData);
            setLayout(vLayout);
            // // setConfig(vConfig);
            // // setFrames([]);
            setMode("READ");
          }}
        ></Search>
      </div>
      <div className="plot">
        <Plot
          layout={layout}
          data={data}
          frames={frames}
          config={config}
          onClick={(e) => {
            clikckBranch(e);
          }}
          onHover={(e) => {
            console.log(1);
          }}
          // onInitialized={(figure) => useState(figure)}
          // onUpdate={(figure) => useState(figure)}
        ></Plot>
        <div className="buttonDiv">{content}</div>
        <div className="questionIcon">
          <FontAwesomeIcon icon={faCircleQuestion} />
          <img src={armLabel} alt="armlabel" />
        </div>
      </div>
    </div>
  );
}

export default App;
