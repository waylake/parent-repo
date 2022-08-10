import "./App.css";
import React from "react";
import Plot from "react-plotly.js";
import "bootstrap/dist/css/bootstrap.min.css"; // bootstrap
import { Grid, Box } from "@material-ui/core"; // material ui
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
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
// import {PythonShell} from 'python-shell';
import { faGripLines, faPray } from "@fortawesome/free-solid-svg-icons";
import { faShuffle } from "@fortawesome/free-solid-svg-icons";
import { InterDetial } from "./component/Modal";
import { useAsync } from "react-async";
import axios from "axios";

// import $ from "jquery";

// async function componentDidMount () {
//   try {
//       const res = await fetch('http://127.0.0.1:8000/api/');
//       const posts = await res.json();
//       this.setState({
//           posts
//       });
//   } catch (e) {
//       console.log(e);
//   }
// }

// const [post, setPost] = useState();

// const Dda = useAsync({
//   promiseFn: componentDidMount,
//   id: 1,
// })
// console.log(Dda);
function App() {
  const [infoDict, setInfoDict] = useState(require("./NCT_ID_database/NCT05488340.json"));
  const dataJson = getInfo(infoDict);
  console.log(infoDict);

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
  const [mode, setMode] = useState("READ");

  let content = "";
  if (mode === "READ") {
    //READ 모드일때 edit버튼을 누르면
    content = (
      <Button
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
          icon={faGripLines}
          onChangeMode={() => {
            // crossover -> parallel 로 바꾸기
            const newInfoDict = { ...infoDict };
            const clickedBranchIdx = []; // 선택된 branch idx 2개 담기
            for (let i = 0; i < data.length; i++) {
              if (data[i].opacity === 0.3) clickedBranchIdx.push(i);
            }
            const armGroupList = newInfoDict.DrugInformation.ArmGroupList;
            newInfoDict.DesignModel = makeNewModel(newInfoDict.DesignModel, armGroupList.length, '-');

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
            newInfoDict.DesignModel = makeNewModel(newInfoDict.DesignModel, armGroupList.length, '+');

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


            // data 클릭 안되게 바꾸기
            const newData = [...data];
            for (let value of newData) {
              if (value.name) value.hoverinfo = "skip";
            }
            setLayout(newVisualizationInfo.Glayout);
            setData(newData);
            setInfoDict(newInfoDict);
            setMode("READ");
          }}
        ></Button>
      </>
    );
  }
  return (
    <Grid container spacing={1}>
      <div className="container">
        <Grid item xs={12}>
          <div className="url">
            <Search className></Search>
          </div>
        </Grid>
        <Grid item xs={12}>
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
                e.points[0].data.opacity =
                  e.points[0].data.opacity === 1 ? 0.3 : 1;
                // console.log(e);
                //화살표 촉 투명도
                for (let value of newLayout.shapes) {
                  if (
                    value.name &&
                    value.name[0] === "arrow" &&
                    value.name[1] === e.points[0].data.name[1]
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
              }}
              onHover={(e) => {
                console.log(1);
              }}
            // onInitialized={(figure) => useState(figure)}
            // onUpdate={(figure) => useState(figure)}
            ></Plot>
            <div className="buttonDiv">{content}</div>
          </div>
        </Grid>
      </div>
    </Grid>
  );
}

export default App;
