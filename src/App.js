import "./App.css";
import React from "react";
import Plot from "react-plotly.js";
// import "bootstrap/dist/css/bootstrap.min.css"; // bootstrap
// import { Grid, Card } from "@mui/material/"; // material ui
//컴포넌트
import Button from "./component/Button";
import Search from "./component/Search";
import Example from "./component/Example";
//함수
import { getInfo } from "./visualization/DataExtraction";
import { visualization } from "./visualization/visualization";
import { changeInfoDict } from "./visualization/edit";
import { moveIdxFront } from "./visualization/edit";
import { removeHtmlTag } from "./visualization/edit";
import { makeNewModel } from "./visualization/edit";
import { postRequest, myRequest, myCrawling, loadRequest, imgSrcRequest, getImgRequest, writeImgRequest, readImgRequest } from "./api";

//state
import { useState, useEffect } from "react";
//아이콘
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import { faGripLines, faFileImport, faCircleQuestion, faShuffle, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";

import armLabel from "./img/label.png";
import armLabel2 from "./img/check1.png";
import "./css/w3-ct.css";
import "./css/print.css";
import "./css/trial-record.css";
import Loading from "./component/Loading";
import { highlight } from "./visualization/highlight";
import { DrawOriginalText } from "./component/OriginalText";

import html2canvas from 'html2canvas';
import History from "./component/History";

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
  const [clicked, setClicked] = useState([]);
  const [isOriginal, setIsOriginal] = useState(false);
  const [isBranchButton, setisBranchButton] = useState(false);
  const [home, setHome] = useState(0);
  const [imgArr, setImgArr] = useState([]);
  const [nctArr, setNctArr] = useState([]);
  const [api, setApi] = useState("acm");
  const [history, setHistory] = useState(0);

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
          value.name.shape === "arrow" &&
          value.name.idx === e.points[0].data.name.idx
        ) {
          value.opacity = 1;
        }
      }
    }
    const newData = [...data];
    setData(newData);
    setLayout(newLayout);
  };

  const modifyBranch = (branchToModified) => {
    //바뀔 인자값 넣기
    const newInfoDict = { ...infoDict };
    let clickedBranchIdx = []; // 선택된 branchidx 2개 담기
    for (let i = 0; i < data.length; i++) {
      if (data[i].opacity === 0.3) clickedBranchIdx.push(i);
    }

    if (branchToModified === "cross") {
      moveIdxFront(newInfoDict, clickedBranchIdx);
      newInfoDict.DesignModel = makeNewModel(
        newInfoDict.DesignModel,
        newInfoDict.DrugInformation.ArmGroupList.length,
        "+"
      );
    }
    else {
      newInfoDict.DesignModel = makeNewModel(
        newInfoDict.DesignModel,
        newInfoDict.DrugInformation.ArmGroupList.length,
        "-"
      );
    }


    const information = getInfo(newInfoDict);
    const visualizationInformation = visualization(information);
    const newData = visualizationInformation.Gdata;
    const newLayout = visualizationInformation.Glayout;

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
    //drug가 아닌 경우 모식도 생성X
    const information = getInfo(json);
    console.log(information);

    const visualizationInformation = visualization(information);
    //data
    const newData = visualizationInformation.Gdata;
    //Layout
    const newLayout = visualizationInformation.Glayout;
    //Config
    const newConfig = visualizationInformation.Gconfig;


    if (json.DesignModel[0] === "c" && json.DrugInformation.ArmGroupList.length > 2)
      setisBranchButton(true);
    else setisBranchButton(false);
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
    let result_text = "<div id='wrapper'></div>";
    const Parser = require("html-react-parser");

    let url = keyword.url;
    try {
      setLoading(true);
      result = await myRequest(keyword);
      if (result?.message) throw result.message;
      result_text += await myCrawling(url);
      setText(Parser(result_text)); // 내용 생성 뒤 render될 수 있도록
      drawGraph(result);
      setVisible(true);
      setMode("read");
      setHistory(history + 1);
    } catch (error) {
      if (error === "It is keyError")
        alert("keyError가 발생하며, 잘못된 url 또는 NCTID일 가능성이 높습니다.");
      else if (error === "It is observational")
        alert("해당 임상시험은 Study Type이 Observational이기 때문에 모식도를 생성하지 않습니다.");
      else if (error === "It is not nctID")
        alert("잘못된 url 또는 NCTID 입니다.");
      else if (error.message ===
        "Cannot read properties of undefined (reading 'Duration')")
        // else if (error === TypeError)
        alert("해당 임상시험은 drug intervention이 아니기 때문에 모식도를 생성하지 않습니다.");
    } finally {
      setLoading(false);
    }

  };


  const saveGraph = async () => { // 편집된 모식도 저장 함수
    let result = '';
    // //편집 완료시 태그 다시 추가 및 박스 크기와 위치 조절
    const newInfoDict = { ...infoDict };
    const annot = layout.annotations;
    changeInfoDict(newInfoDict, annot);
    try {
      result = await postRequest(newInfoDict);
    } catch (error) {
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
      <>{isBranchButton &&
        <>
          <Button
            mode="parallel"
            icon={faGripLines}
            onChangeBranch={modifyBranch} // cross over -> parallel로 바꾸기
          ></Button>

          <Button
            mode="cross"
            icon={faShuffle}
            onChangeBranch={modifyBranch} // parallel -> cross over로 바꾸기
          ></Button>
        </>
      }
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


  const setImg = async () => {
    const graphImg = document.querySelector("#plot > div.js-plotly-plot");

    if (graphImg) {
      const canvas = await html2canvas(graphImg);
      let url = canvas.toDataURL('image/png');
      url = url.replace("data:image/png;base64,", "");

      let result;
      try {
        result = await writeImgRequest(url, infoDict.NCTID);
      }
      catch (error) {
        console.log(error);
      }

    }
  };

  const getImg = async () => {
    let result;
    try {
      result = await readImgRequest();
    }
    catch (error) {
      console.log(error);
    }
    const { images, ncts } = result;
    setImgArr(images);
    setNctArr(ncts);
  }





  useEffect(() => {
    setImg();

  }, [history]);

  useEffect(() => {
    getImg();
  }, [home])



  return (
    <div>
      <div id={loading ? "darkContainer" : "container"}>
        <div id="intro">
          <div>
            <div id="servicename">Moseek<img id="moseekimg" src={armLabel2} alt="armlabel2" /></div>
            <div id="mainSentence">Generate ClinicalTrial Schematic Diagram automatically</div>
            <div id="description">Our service 'Moseek' will Automatically draw ClinicalTrial Schematic Diagram for your future experiment and project.<br />
              Edit detail inforamtion or branch design and Download it is possible.
            </div>
          </div>
        </div>
        <div className="url">
          <Search onCreate={clickCreate}></Search>
        </div>
        {!visible && <div className="contents"><History imgArr={imgArr} nctArr={nctArr} onClick={clickCreate} /></div>}
        {visible && (
          <div className="contents">
            <div id="original">
              <DrawOriginalText txt={text}></DrawOriginalText>
            </div>
            <div
              id="draggable"
              draggable="true"
              onDragStart={initial}
              onDrag={resize}
            ></div>
            <div id="plot">
              <Plot
                layout={layout}
                data={data}
                frames={frames}
                config={config}
                onClick={(e) => {
                  clikckBranch(e);
                }}
                onClickAnnotation={(e) => {
                  setClicked(true);
                  highlight(e, infoDict);
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