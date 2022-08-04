import { Point } from "./Point";
import { drawPopulation } from "./drawPopulation";
import { drawPreIntervention } from "./drawPreIntervention";
import { countLine } from "./drawPopulation";

import { drawBranch } from "./drawBranch";
import { drawInfoTrial, lineBreak } from "./drawInfoTrial";
import { writeIntervention } from "./writeIntervention";

export function visualization(data) {
  // data from extraction
  let designModel = data.designModel;
  let population = data.population;
  let infoTrial = data.infoTrial;
  let armGroup = data.armGroup;
  let intervention = data.intervention;

  // gather altogether
  let Gdata = [];
  let Glayout = {
    shapes: [],
    annotations: [],
    yaxis: {
      range: [],
      showgrid: false,
      showticklabels: false,
    },
    width: 800,
    height: 800,
    // autosize: true,
    xaxis: {
      range: [9, 29],
      showgrid: false,
      showticklabels: false,
    },
    legend: {
      x: 0.05, //x: -2~3
      y: 0.18, //y: -2~3 /////////// how to control the position without using absolute position
      font: {
        size: 9,
      },
      tracegroupgap: 10,
      itemclick: false, // 클릭했을 때 아무일도 일어나지 않게
      itemdoubleclick: false, // 더블 클릭했을 때 아무일도 일어나지 않게
      itemwidth: 25, // 범례 그래프의 길이
      bordercolor: "black",
      // bgcolor: 'rgb(255, 235, 240)', 밑에서 작업.
      showlegend: false,
    },
  };
  let Gframes = [];
  let Gconfig = {
    edits: {
      annotationText: false,
    },
    modeBarButtonsToRemove: ["zoomIn2d", "zoomOut2d", "zoom2d", "autoScale2d"],
    displayModeBar: true,
  };

  let startPoint = new Point(10, 10);
  let startW = 5;
  const popDrawInfo = drawPopulation(startPoint, startW, population);
  const startH = popDrawInfo.startH;
  const numberPoint = new Point(
    startPoint.x + startW,
    startPoint.y + startH / 2
  );
  const numberW = 2;
  // # allocation
  const radius = 0.6;
  const allocationPoint = new Point(
    numberPoint.x + numberW + radius,
    numberPoint.y
  );

  let armGLinePoint1 = new Point(allocationPoint.x + radius, allocationPoint.y);
  let armGW = 1;
  let armGArrowW = 7;
  let legendPoint = new Point(startPoint.x, startPoint.y - startH / 6);

  // draw branch
  let branchDrawInfo = drawBranch(
    armGLinePoint1,
    armGW,
    armGArrowW,
    startPoint,
    startH,
    legendPoint,
    intervention,
    designModel,
    armGroup
  );

  //drawInfoTrial
  let durationPoint = new Point(
    armGLinePoint1.x + armGW + armGArrowW,
    allocationPoint.y - (startH * 2) / 3
  );
  let numArm = armGroup.armGroupLabel.length;

  // objective
  const objPoint = new Point(startPoint.x, startPoint.y + startH + 0.1);
  const [objectiveLine, objective] = lineBreak(
    "Objective: " + infoTrial.objective,
    83
  );
  // title
  const titlePoint = new Point(objPoint.x, objPoint.y + objectiveLine / 20);
  // official title
  const officialPoint = new Point(
    startPoint.x ,
    startPoint.y - startH / 2
  );
  // entity
  let detailDrawInfo = drawInfoTrial(
    durationPoint,
    startPoint,
    startH,
    legendPoint,
    objPoint,
    titlePoint,
    officialPoint,
    numArm,
    infoTrial
  );

  const moseekH = detailDrawInfo.yRange[1] - detailDrawInfo.yRange[0];
  console.log(moseekH);
  const preInterDrawInfo = drawPreIntervention(
    numberPoint,
    numberW,
    allocationPoint,
    radius,
    moseekH,
    intervention
  );

  // 합치기 수정 필요
  Glayout.shapes = Glayout.shapes.concat(
    popDrawInfo.layout.shapes,
    preInterDrawInfo.layout.shapes
  );
  Glayout.annotations = Glayout.annotations.concat(
    popDrawInfo.layout.annotations
  );
  Glayout.annotations = Glayout.annotations.concat(
    preInterDrawInfo.layout.annotations
  );
  //push info into G Lists
  Gdata = Gdata.concat(branchDrawInfo.data.lineList); // branch lines
  Glayout.shapes = Glayout.shapes.concat(branchDrawInfo.layout.arrowList); // branch arrow point
  Gdata = Gdata.concat(detailDrawInfo.data); // comeplete time
  Glayout.annotations = Glayout.annotations.concat(
    detailDrawInfo.layout.annotations
  ); // title, official title, objective
  Glayout.annotations = Glayout.annotations.concat(branchDrawInfo.layout.annotations); // legend
  Glayout.yaxis.range = Glayout.yaxis.range.concat(detailDrawInfo.yRange); // 모식도 전체 크기

  let yRange = detailDrawInfo.yRange;

  let intervenWrite = writeIntervention(
    startPoint,
    startH,
    armGLinePoint1,
    armGW,
    armGArrowW,
    branchDrawInfo.washHeight.washH,
    designModel,
    armGroup,
    intervention,
    yRange
  );
  Glayout.annotations = Glayout.annotations.concat(intervenWrite.layout);

  // legend y 재설정
  let legendPosition =
    (officialPoint.y - detailDrawInfo.yRange[0]) / (moseekH*1.3);
    // /(moseekH * (2.2 + numArm*0.1)) + (numArm * 0.1);
  // if (numArm > 2) {
  //   legendPosition =
  //     (startPoint.y + officialPoint.y - detailDrawInfo.yRange[0] * 2) /2
  //     /(moseekH * (2.5 - numArm * 0.01));
  // }
  // Glayout.legend.y = legendPosition;
  Glayout.legend.y = legendPosition;
  // legend gap 재설정 : 적용 안됨...
  //// Glayout.legend.tracegroupgap =['reversed', 'grouped', 'normal', 'normal','normal','normal', ]
  //// Glayout.legend.traceorder = 100

  // legend bg color
  if (
    ((designModel === "Single Group Assignment") &
      ("Other" in armGroup.armGroupType)) |
    ("Experimental" in armGroup.armGroupType)
  ) {
    Glayout.legend.bgcolor = "rgb(255, 235, 240)";
  } else {
    Glayout.legend.bgcolor = "rgb(232, 245, 255)";
  }

  Glayout.showlegend = false; // legend보여주지 않기

  // gather altogether
  return {
    Gdata,
    Glayout,
    Gframes,
    Gconfig,
  };
  // let durationPoint = new Point(armGLinePoint1.x+armGW+armGArrowW+1, allocationPoint.y-startH);
  // let numArm = armGroup.armGroupLabel.length;

  // ax 설정하는 부분은 아직 안 적음.
}
