export function drawBranch(
  armGLinePoint1,
  armGW,
  armGArrowW,
  startPoint,
  startH,
  legendPoint,
  intervention,
  designModel,
  armG
) {
  const armColorDict = {
    Experimental: "rgba(205, 31, 72, 1)", //coral
    OtherS: "rgba(255, 210, 40, 1)", //gold
    "Active Comparator": "rgb(10, 138, 138)", //진한 에메랄드
    "Placebo Comparator": "rgba(70, 189, 123, 1)", //lime green
    "No Intervention": "rgba(0, 100, 0, 1)", // forest green
    Other: "rgb(102, 205, 170)", // 살짝 밝은 에메랄드
    "Sham Comparator": "rgba(70, 70, 205, 1)", //blue
    None: "rgba(148, 20, 148, 1)", // violet
  };

  let setArmGroup = new Set(armG.armGroupType);
  let setArmGroupToLst = Array.from(setArmGroup);
  const numBranch = armG.interventionDescription.length;

  const widthTriangle = 0.005
  const heightTriangle = 0.2

  let lineList = [];
  let arrowList = [];
  let washH;
  let arrowIdx = 0;

  //draw branch
  if ((designModel === "Crossover Assignment" & typeof intervention.washoutPeriod == "String" & numBranch === 2)) {
    for (let i = 0; i < numBranch; i++) {
      let colorB = armColorDict[armG.armGroupType[i]];
      let arrowEndY = startPoint.y + i * (startH / (numBranch - 1))
      let arrowEndX = armGLinePoint1.x + armGW + armGArrowW + 0.5
      let lineLoc = {
        name: armG.armGroupType[i],
        x: [
          armGLinePoint1.x,
          armGLinePoint1.x + armGW,
          armGLinePoint1.x + armGW + armGArrowW / 3,
          armGLinePoint1.x + armGW + (armGArrowW / 3) * 2,
          arrowEndX,
        ],
        y: [
          armGLinePoint1.y,
          startPoint.y + startH - i * (startH / (numBranch - 1)),
          startPoint.y + startH - i * (startH / (numBranch - 1)),
          arrowEndY,
          arrowEndY,
        ],
        mode: "lines",
        line: {
          color: colorB,
          width: 4,
        },
        // hoverinfo: "skip", // branch 라인 위에 마우스 올렸을 때 데이터 보이지 않도록 설정
      };
      lineList.push(lineLoc);
      let lineArrow = {
        type: 'path',
        // 0.2는 삼각형 높이
        path: `M ${arrowEndX - heightTriangle} ${arrowEndY} V ${arrowEndY + widthTriangle} 
              L ${arrowEndX} ${arrowEndY} L ${arrowEndX - heightTriangle} ${arrowEndY - widthTriangle} Z`,
        fillcolor: colorB, // 채우기 색깔
        line: { color: colorB }, // 테두리 색깔
        name: ['arrow', arrowIdx++]
      };
      arrowList.push(lineArrow);
    }

    // ##crossover 약 먹는 기간 화살표
    let bfWashPoint = armGLinePoint1.x + armGW + armGArrowW / 3;
    let afWashPoint = armGLinePoint1.x + armGW + (armGArrowW / 3) * 2;
    washH = startPoint.y - startH / 10;
    let timeLine = {
      x: [armGLinePoint1.x, armGLinePoint1.x + armGW + armGArrowW + 0.5],
      y: [washH, washH],
      mode: "lines",
      line: {
        color: "rgba(1,1,1,1)",
        width: 4,
      },
      showlegend: false,
      hoverinfo: "skip", // branch 라인 위에 마우스 올렸을 때 데이터 보이지 않도록 설정
    };
    lineList.push(timeLine);

    let mark = {
      x: [bfWashPoint, afWashPoint],
      y: [washH, washH],
      mode: "markers",
      marker: {
        size: [10, 10],
        color: "rgba(255, 120, 120, 1)",
      },
      showlegend: false,
      hoverinfo: "skip", // branch 라인 위에 마우스 올렸을 때 데이터 보이지 않도록 설정
    };
    lineList.push(mark);
  } else if (designModel === "Parallel Assignment" || numBranch !== 1) {
    // limit number of branch
    let numBranchLimit = numBranch
    if (numBranch > 6) {
      numBranchLimit = 6
    }

    // draw Branch
    for (let i = 0; i < numBranchLimit; i++) {
      let colorB = armColorDict[armG.armGroupType[i]];
      let arrowEndY = startPoint.y + startH - i * (startH / (numBranchLimit - 1))
      let arrowEndX = armGLinePoint1.x + armGW + armGArrowW
      let lineLoc = {
        name: armG.armGroupType[i],
        x: [
          armGLinePoint1.x,
          armGLinePoint1.x + armGW,
          arrowEndX,
        ],
        y: [
          armGLinePoint1.y,
          arrowEndY,
          arrowEndY,
        ],
        mode: "lines",
        line: {
          color: colorB,
          width: 4,
        },
        // hoverinfo: "skip", // 모식도 데이터 오버이벤트 없애기
      };
      lineList.push(lineLoc);

      let lineArrow = {
        type: 'path',
        // 0.2는 삼각형 높이
        path: `M ${arrowEndX - heightTriangle} ${arrowEndY} V ${arrowEndY + widthTriangle} 
              L ${arrowEndX} ${arrowEndY} L ${arrowEndX - heightTriangle} ${arrowEndY - widthTriangle} Z`,
        fillcolor: colorB, // 채우기 색깔
        line: { color: colorB }, // 테두리 색깔
        name: ['arrow', arrowIdx++]
      };
      arrowList.push(lineArrow);
    }
  } else if (designModel === "Single Group Assignment" || numBranch === 1) {
    let colorB = armColorDict[armG.armGroupType[0]];
    let arrowEndX = armGLinePoint1.x + armGW + armGArrowW;
    let arrowEndY = armGLinePoint1.y
    if (armG.armGroupType[0] === "Other") {
      colorB = armColorDict["OtherS"];
    }
    let lineLoc = {
      name: armG.armGroupType[0],
      x: [armGLinePoint1.x, arrowEndX],
      y: [arrowEndY, arrowEndY],
      mode: "lines",
      line: {
        color: colorB,
        width: 4,
      },
    };
    lineList.push(lineLoc);
    let lineArrow = {
      type: 'path',
      // 0.2는 삼각형 높이
      path: `M ${arrowEndX - heightTriangle} ${arrowEndY} V ${arrowEndY + widthTriangle} 
            L ${arrowEndX} ${arrowEndY} L ${arrowEndX - heightTriangle} ${arrowEndY - widthTriangle} Z`,
      fillcolor: colorB, // 채우기 색깔
      line: { color: colorB }, // 테두리 색깔
      name: ['arrow', arrowIdx++]
    };
    arrowList.push(lineArrow);
  } else {
    console.log(
      "we only consider single, parallel, crossover or may be sequential!"
    );
  }

  return {
    data: {
      lineList,
    },
    layout: {
      arrowList
    },
    washHeight: { washH },
  };
}
