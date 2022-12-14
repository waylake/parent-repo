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
import { domToReact } from 'html-react-parser';
import html2canvas from 'html2canvas';
import History from "./component/History";

function App() {
  const [infoDict, setInfoDict] = useState();

  // crossover : NCT04450953
  // 군 엄청 많아: NCT04844424
  // 약 엄청 많아: NCT02374567

  // for biolinkbert version
  const [dataBio, setDataBio] = useState();
  const [layoutBio, setLayoutBio] = useState();
  const [framesBio, setFramesBio] = useState();
  const [configBio, setConfigBio] = useState();
  const [isBio, setBio] = useState(true);
  const [isTwo, setTwo] = useState(false);

  // for acm version
  const [dataAcm, setDataAcm] = useState();
  const [layoutAcm, setLayoutAcm] = useState();
  const [framesAcm, setFramesAcm] = useState();
  const [configAcm, setConfigAcm] = useState();

  const [mode, setMode] = useState("read");
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState();
  const [loading, setLoading] = useState(false);
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
    if (isBio) {
      const newLayout = { ...layoutBio };
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
      for (let value of dataBio) {
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
      const newData = [...dataBio];
      setDataBio(newData);
      setLayoutBio(newLayout);
    }
    // if is Bio isn't selected
    else {
      const newLayout = { ...layoutAcm };
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
      for (let value of dataAcm) {
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
      const newData = [...dataAcm];
      setDataAcm(newData);
      setLayoutAcm(newLayout);
    }
  };

  const modifyBranch = (branchToModified) => {
    //바뀔 인자값 넣기
    if (isBio) {
      const newInfoDict = { ...infoDict };
      let clickedBranchIdx = []; // 선택된 branchidx 2개 담기
      for (let i = 0; i < dataBio.length; i++) {
        if (dataBio[i].opacity === 0.3) clickedBranchIdx.push(i);
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
      setLayoutBio(newLayout);
      setDataBio(newData);
    }
    else {
      const newInfoDict = { ...infoDict };
      let clickedBranchIdx = []; // 선택된 branchidx 2개 담기
      for (let i = 0; i < dataAcm.length; i++) {
        if (dataAcm[i].opacity === 0.3) clickedBranchIdx.push(i);
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
      setLayoutAcm(newLayout);
      setDataAcm(newData);
    }

  };

  const editGraph = () => { // 모식도 편집되게 바꾸기 함수
    // editable하게 바꾸기
    if (isBio) {

      const newConfig = { ...configBio };
      newConfig.edits.annotationText = true;


      // Layout값 바꾸기
      const newLayout = { ...layoutBio };
      const annot = newLayout.annotations;
      //Html tag 제거
      removeHtmlTag(annot);

      // data 클릭 되게 바꾸기
      const newData = [...dataBio];
      for (let value of newData) {
        if (value.name) value.hoverinfo = "none";
      }
      setConfigBio(newConfig);
      setDataBio(newData);
      setLayoutBio(newLayout);
      setMode("edit");
    }
    else {
      const newConfig = { ...configAcm };
      newConfig.edits.annotationText = true;

      // Layout값 바꾸기
      const newLayout = { ...layoutAcm };
      const annot = newLayout.annotations;
      //Html tag 제거
      removeHtmlTag(annot);

      // data 클릭 되게 바꾸기
      const newData = [...dataAcm];
      for (let value of newData) {
        if (value.name) value.hoverinfo = "none";
      }
      setConfigAcm(newConfig);
      setDataAcm(newData);
      setLayoutAcm(newLayout);
      setMode("edit");
    }
  };

  const drawGraph = async (json, isBio) => { //모식도 그리기 함수
    //drug가 아닌 경우 모식도 생성X
    if (isBio) {
      const information = getInfo(json); // 혹시 이게 달라질 수 있는건가
      console.log("Bio");

      const visualizationInformation = visualization(information);
      const newData = visualizationInformation.Gdata; //data
      const newLayout = visualizationInformation.Glayout; //Layout
      const newConfig = visualizationInformation.Gconfig; //Config


      if ((json.DesignModel[0] === "c" || json.DesignModel[0] === "C") && json.DrugInformation.ArmGroupList.length > 2)
        setisBranchButton(true);
      else setisBranchButton(false);
      setDataBio(newData);
      setLayoutBio(newLayout);
      setConfigBio(newConfig);
      setInfoDict(json);

    }
    else {
      const information = getInfo(json);
      console.log("Acm");

      const visualizationInformation = visualization(information);
      const newData = visualizationInformation.Gdata; //data
      const newLayout = visualizationInformation.Glayout; //Layout
      const newConfig = visualizationInformation.Gconfig; //Config


      if (json.DesignModel[0] === "c" && json.DrugInformation.ArmGroupList.length > 2)
        setisBranchButton(true);
      else setisBranchButton(false);
      setDataAcm(newData);
      setLayoutAcm(newLayout);
      setConfigAcm(newConfig);
      setInfoDict(json);
      // setBio(true);
    }
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

    const options = {
      replace: ({ name, children, attribs }) => {
        const list = ["studydesc", "studydesign", "wrapper", "armgroup", "eligibility"];

        if (name === 'a') {
          const result = list.some((el) => el === attribs.id);
          if (!result) return <a>{domToReact(children, options)}</a>;
        }

        if (name === 'button' && attribs.class === "tr-dropbtn") return <span></span>
        if (name === 'div' && attribs.class === "tr-dropdown-content") return <span></span>
      }
    }

    let url = keyword.url;
    try {
      setLoading(true);
      result = await myRequest(keyword);
      if (result?.message) throw result.message;
      result_text += await myCrawling(url);

      setText(Parser(result_text, options)); // 내용 생성 뒤 render될 수 있도록
      console.log("before drawing graph: ", result.biolink);
      if (result.biolink != null) {
        // 2개의 json이 있는 경우
        let bioJson = result["biolink"];
        let acmJson = result["acm"];
        await drawGraph(bioJson, true);
        await drawGraph(acmJson, false);
        setTwo(true);
      } else {
        // 1개인 경우 == biolinkbert + acm의 case
        setBio(true);
        setTwo(false);
        drawGraph(result, true);
      }
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
      // else if (error.message ===
      //   "Cannot read properties of undefined (reading 'Duration')")
      //   // else if (error === TypeError)
      //   alert("해당 임상시험은 drug intervention이 아니기 때문에 모식도를 생성하지 않습니다.");
    } finally {
      setLoading(false);
    }

  };


  const saveGraph = async () => { // 편집된 모식도 저장 함수
    if (isBio) {
      let result = '';
      // //편집 완료시 태그 다시 추가 및 박스 크기와 위치 조절
      const newInfoDict = { ...infoDict };
      const annot = layoutBio.annotations;
      changeInfoDict(newInfoDict, annot);
      try {
        result = await postRequest(newInfoDict);
      } catch (error) {
        console.log(error);
      }
      drawGraph(result, true);
      setMode("read");
    }
    else {
      let result = '';
      // //편집 완료시 태그 다시 추가 및 박스 크기와 위치 조절
      const newInfoDict = { ...infoDict };
      const annot = layoutAcm.annotations;
      changeInfoDict(newInfoDict, annot);
      try {
        result = await postRequest(newInfoDict);
      } catch (error) {
        console.log(error);
      }
      drawGraph(result, false);
      setMode("read");
    }
  };

  const loadOriginal = async () => {
    let result;
    try {
      result = await loadRequest(infoDict.NCTID);
    }
    catch (error) {
      console.log(error);
    }
    drawGraph(result, isBio);
    setMode("read");
    setIsOriginal(true);
  };

  const loadEdited = async () => { // 원본 모식도 그리기
    let result;
    try {
      result = await myRequest({ url: infoDict.NCTID });
    } catch {
      console.log("error");
    }
    drawGraph(result, isBio);
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
    const graphImg = document.querySelector("#plot > #firstPlot div.js-plotly-plot");

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
  };

  const deleteHref = () => {
    const aTags = document.querySelectorAll("#original a");
    aTags.forEach((tag) => {
      tag.removeAttribute('href');
    })
  };



  useEffect(() => {
    setImg();
    // deleteHref();

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
            <div id={isTwo ? "originalTwo" : "original"}>
              <DrawOriginalText txt={text}></DrawOriginalText>
            </div>
            <div
              id={isTwo ? "draggableTwo" : "draggable"}
              draggable="true"
              onDragStart={initial}
              onDrag={resize}
            ></div>
            <div id="plot">
              <div id="firstPlot">
                <div id="title_bio">
                  ACM+Biolinkbert
                </div>
                <Plot
                  layout={layoutBio}
                  data={dataBio}
                  frames={framesBio}
                  config={configBio}
                  onClick={(e) => {
                    clikckBranch(e);
                  }}
                  onClickAnnotation={(e) => {
                    highlight(e, infoDict, isTwo);
                  }}
                ></Plot>
                <div className="buttonDiv">{content}</div>
                <div className="questionIcon">
                  <FontAwesomeIcon icon={faCircleQuestion} />
                  <img src={armLabel} alt="armlabel" />
                </div>
              </div>
              <div id={isTwo ? "secondPlot" : "hidden_plot"}>
                <div id="title_acm">
                  Only ACM
                </div>
                <Plot
                  layout={layoutAcm}
                  data={dataAcm}
                  frames={framesAcm}
                  config={configAcm}
                  onClick={(e) => {
                    clikckBranch(e);
                  }}
                  onClickAnnotation={(e) => {
                    console.log("from second plot annotation");
                    highlight(e, infoDict, isTwo);
                  }}
                ></Plot>
                {/* <div className="buttonDiv">{content}</div>
                <div className="questionIcon">
                  <FontAwesomeIcon icon={faCircleQuestion} />
                  <img src={armLabel} alt="armlabel" />
                </div> */}
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