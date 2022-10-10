import "./App.css";
import React from "react";
import Plot from "react-plotly.js";
// import "bootstrap/dist/css/bootstrap.min.css"; // bootstrap
// import { Grid, Card } from "@mui/material/"; // material ui
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
import { postRequest, myRequest, myCrawling, loadRequest } from "./api";

//state
import { useState, useEffect } from "react";
//아이콘
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faFloppyDisk } from "@fortawesome/free-regular-svg-icons";

import { faGripLines, faFileImport, faCircleQuestion, faShuffle, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";



//img
import armLabel from "./img/label.png";


import "./css/w3-ct.css";
import "./css/print.css";
import "./css/trial-record.css";
import Loading from "./component/Loading";

function App() {
  const [infoDict, setInfoDict] = useState();

  // crossover : NCT04450953
  // 군 엄청 많아: NCT04844424
  // 약 엄청 많아: NCT02374567

  const [data, setData] = useState();
  const [layout, setLayout] = useState();
  const [frames, setFrames] = useState();
  const [config, setConfig] = useState();
  const [mode, setMode] = useState("read");
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState();
  const [loading, setLoading] = useState(false);
  const [isOriginal, setIsOriginal] = useState(false);
  // these below are for resizable div contents.
  const [initialPos, setInitialPos] = useState(null);
  const [initialSize, setInitialSize] = useState(null);

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

  const modifyBranch = (branchToModified) => { //바뀔 인자값 넣기
    const newInfoDict = { ...infoDict };
    let clickedBranchIdx = []; // 선택된 branchidx 2개 담기
    for (let i = 0; i < data.length; i++) {
      if (data[i].opacity === 0.3) clickedBranchIdx.push(i);
    }
    if (branchToModified === 'cross') moveIdxFront(newInfoDict, clickedBranchIdx);

    newInfoDict.DesignModel = makeNewModel(
      newInfoDict.DesignModel,
      newInfoDict.DrugInformation.ArmGroupList.length,
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

  };

  const editGraph = () => { // 모식도 편집되게 바꾸기 함수
    // editable하게 바꾸기
    const newConfig = { ...config };
    newConfig.edits.annotationText = true;


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
    setConfig(newConfig);
    setData(newData);
    setLayout(newLayout);
    setMode("edit");
  };

  const drawGraph = (json) => { //모식도 그리기 함수
    const information = getInfo(json);
    const visualizationInformation = visualization(information);
    //data
    const newData = visualizationInformation.Gdata;
    //Layout
    const newLayout = visualizationInformation.Glayout;
    //Config
    const newConfig = visualizationInformation.Gconfig;

    setData(newData);
    setLayout(newLayout);
    setConfig(newConfig);
    setInfoDict(json);
  };

  const initial = (e) => {
    let resizable = document.getElementById("original");

    setInitialPos(e.clientX);
    setInitialSize(resizable.offsetWidth);
  };

  const resize = (e) => {
    let resizable = document.getElementById("original");
    let re_bar = document.getElementById("draggable");

    resizable.style.width = `${parseInt(initialSize) + parseInt(e.clientX - initialPos)
      }px`;

    re_bar.style.backgroundPositionX = `${parseInt(initialPos)}`;
  };

  // const createOriginal = async (keyword) => {
  //   let result_text;
  //   const Parser = require("html-react-parser");
  //   try {
  //     setLoading(true);
  //     result_text = await myCrawling(keyword);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  //   setText(Parser(result_text)); // 내용 생성 뒤 render될 수 있도록
  // }


  const clickCreate = async (keyword) => { // 크롤링 및 모식도 한번에 동시 생성
    let result;
    let result_text;
    const Parser = require("html-react-parser");
    try {
      setLoading(true);
      result = await myRequest(keyword);
      result_text = await myCrawling(keyword);
    } catch (error) {
      console.log("error");
    }
    finally {
      setLoading(false);
    }
    setText(Parser(result_text)); // 내용 생성 뒤 render될 수 있도록
    drawGraph(result);
    setVisible(true);
    setMode("read");
  };


  const saveGraph = async () => { // 편집된 모식도 저장 함수
    let result = '';
    // //편집 완료시 태그 다시 추가 및 박스 크기와 위치 조절
    const newInfoDict = { ...infoDict };
    const annot = layout.annotations;
    changeInfoDict(newInfoDict, annot);
    try {
      result = await postRequest(newInfoDict);
    }
    catch (error) {
      console.log(error);
    }
    drawGraph(result);
    setMode("read");
  };

  const loadOriginal = async () => {
    let result;
    try {
      result = await loadRequest(infoDict.NCTID);
    }
    catch (error) {
      console.log(error);
    }
    drawGraph(result);
    setMode("read");
    setIsOriginal(true);
  };

  const loadEdited = async () => { // 원본 모식도 그리기
    let result;
    try {
      result = await myRequest(infoDict.NCTID);
    } catch {
      console.log("error");
    }
    drawGraph(result);
    setMode("read");
    setIsOriginal(false);
  };



  let content = "";
  if (mode === "read") {
    //READ 모드일때 edit버튼을 누르면
    content = (
      <>
        {!isOriginal &&
          <Button
            mode="edit"
            icon={faPenToSquare}
            onChangeMode={editGraph}
          />}
        <Button
          mode={isOriginal ? "loadEdited" : "loadOriginal"}
          icon={isOriginal ? faArrowRotateLeft : faFileImport}
          onChangeMode={isOriginal ? loadEdited : loadOriginal}
        />
      </>
    );
  } else if (mode === "edit") {
    content = (
      <>
        <Button
          mode="parallel"
          icon={faGripLines}
          onChangeBranch={modifyBranch}// cross over -> parallel로 바꾸기
        ></Button>

        <Button
          mode="cross"
          icon={faShuffle}
          onChangeBranch={modifyBranch}// parallel -> cross over로 바꾸기
        ></Button>

        <Button
          mode="save"
          icon={faFloppyDisk}
          onChangeMode={saveGraph}
        ></Button>
        <Button
          mode={isOriginal ? "loadEdited" : "loadOriginal"}
          icon={isOriginal ? faArrowRotateLeft : faFileImport}
          onChangeMode={isOriginal ? loadEdited : loadOriginal}
        />
      </>
    );
  }

  return (
    <div>
      <div id={loading ? "darkContainer" : "container"}>
        <div className="url">
          <Search onCreate={clickCreate}></Search>
        </div>
        {visible && (
          <div className="contents">
            <div id="original">{text}</div>
            <div
              id="draggable"
              draggable="true"
              onDragStart={initial}
              onDrag={resize}>
            </div>
            <div id="plot">
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
              ></Plot>
              <div className="buttonDiv">{content}</div>
              <div className="questionIcon">
                <FontAwesomeIcon icon={faCircleQuestion} />
                <img src={armLabel} alt="armlabel" />
              </div>
            </div>
          </div>
        )}
      </div>
      {loading && <Loading />}
    </div>

  );
}

export default App;
