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
  const colorBranch = [
    "lightcoral",
    "gold",
    "limegreen",
    "forestgreen",
    "cornflowerblue",
    "royalblue",
    "violet",
    "pink",
  ];
  const armColorDict = {
    Experimental: "rgba(205, 31, 72, 1)", //coral
    "Active Comparator": "rgba(255, 210, 40, 1)", //gold
    "Placebo Comparator": "rgba(70, 189, 123, 1)", //lime green
    "No Intervention": "rgba(0, 100, 0, 1)", // forest green
    Other: "rgba(50, 190, 190, 1)", // light blue
    "Sham Comparator": "rgba(70, 70, 205, 1)", //blue
    None: "rgba(148, 20, 148, 1)", // violet
  };

  let setArmGroup = new Set(armG.armGroupType);
  let listArmGroup = Array.from(setArmGroup); // ? 범례 안그려도 된다면 필요없는 칭구
  const numBranch = armG.interventionDescription.length;
  let lineList = [];

  //// draw legend
  // if (designModel !== "Factorial Assignment") {
  //   for (let i = 0; i < listArmGroup.length; i++) {
  //     // ax.plot([legendPoint.x, legendPoint.x + 1], [legendPoint.y -i*startH/8, legendPoint.y -i*startH/8], armColorDict[listArmGroup[i]])
  //     let legendLineLoc = {
  //       x: [legendPoint.x, legendPoint.x + 1],
  //       y: [legendPoint.y - (i * startH) / 8, legendPoint.y - (i * startH) / 8],
  //       mode: "lines",
  //       line: {
  //         color: armColorDict[listArmGroup[i]],
  //         width: 3,
  //       },
  //     };
  //     lineList.push(legendLineLoc);
  //     // ax.text(legendPoint.x + 1 + 0.1 , legendPoint.y -i*startH/8, ListArmGroup[i])
  //     // console.log(i+": "+legendLineLoc);
  //   }
  // } else {
  //   console.log(
  //     "we only consider single, parallel, crossover or may be sequential!"
  //   );
  // }

  //draw branch
  if (designModel === "Crossover Assignment") {
    for (let i = 0; i < numBranch; i++) {
      let colorB = armColorDict[armG.armGroupType[i]];
      let lineLoc = {
        x: [
          armGLinePoint1.x,
          armGLinePoint1.x + armGW,
          armGLinePoint1.x + armGW + armGArrowW / 3,
          armGLinePoint1.x + armGW + (armGArrowW / 3) * 2,
          armGLinePoint1.x + armGW + armGArrowW,
        ],
        y: [
          armGLinePoint1.y,
          startPoint.y + startH - i * (startH / (numBranch - 1)),
          startPoint.y + startH - i * (startH / (numBranch - 1)),
          startPoint.y + i * (startH / (numBranch - 1)),
          startPoint.y + i * (startH / (numBranch - 1)),
        ],
        mode: "lines",
        line: {
          color: colorB,
          width: 2,
        },
      };
      lineList.push(lineLoc);
    }

    // ##crossover 약 먹는 기간 화살표
    let bfWashPoint = armGLinePoint1.x + armGW + armGArrowW / 3;
    let afWashPoint = armGLinePoint1.x + armGW + (armGArrowW / 3) * 2;
    let washH = armGLinePoint1.y - startH / 4 - 0.4;
    let timeLine = {
      x: [armGLinePoint1.x, armGLinePoint1.x + armGW + armGArrowW],
      y: [washH, washH],
      mode: "lines",
      line: {
        color: "rgba(1,1,1,1)",
        width: 2,
      },
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
    };
    lineList.push(mark);
  } else if (designModel === "Parallel Assignment" || numBranch !== 1) {
    for (let i = 0; i < numBranch; i++) {
      let colorB = armColorDict[armG.armGroupType[i]];
      let lineLoc = {
        x: [
          armGLinePoint1.x,
          armGLinePoint1.x + armGW,
          armGLinePoint1.x + armGW + armGArrowW,
        ],
        y: [
          armGLinePoint1.y,
          startPoint.y + startH - i * (startH / (numBranch - 1)),
          startPoint.y + startH - i * (startH / (numBranch - 1)),
        ],
        mode: "lines",
        line: {
          color: colorB,
          width: 2,
        },
      };
      lineList.push(lineLoc);
    }
  } else if (designModel === "Single Group Assignment" || numBranch === 1) {
    let colorB = armColorDict[armG.armGroupType[0]];
    let lineLoc = {
      x: [
        armGLinePoint1.x,
        armGLinePoint1.x + armGW + armGArrowW,
      ],
      y: [
        armGLinePoint1.y,
        armGLinePoint1.y,
      ],
      mode: "lines",
      line: {
        color: colorB,
        width: 2,
      },
    };
    lineList.push(lineLoc);
  } else {
    console.log(
      "we only consider single, parallel, crossover or may be sequential!"
    );
  }

  return {
    branch: {
      lineList,
    },
  };
}
