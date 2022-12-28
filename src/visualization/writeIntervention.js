import { countLine } from "./drawPopulation";
import { lineBreak } from "./drawInfoTrial";
import { hover } from "@testing-library/user-event/dist/hover";

export function writeIntervention(
  startPoint,
  startH,
  armGLinePoint1,
  armGW,
  armGArrowW,
  washH,
  designModel,
  armG,
  intervention,
  yRange
) {
  let numBranch = armG.interventionDescription.length;
  let annotations = [];
  let drugDescription = "";
  let drugHowToTake = "";
  let onlyDrug = "";
  let textStartX;
  let testStartY;
  let drugInfo;
  let interventionTypeList = intervention.typelist

  const intervenFontSize = 12;
  const intervenDurFontSize = 9;
  const intervenHoverFontSize = 13;
  const intervenBranchLetterLimit = 34;
  const intervenHoverLetterLimit = 15;
  let res;
  let drugNameIdx = 0;
  let durationIdx = 0;

  // write intervention
  if (
    (designModel === "Single Group Assignment" && numBranch === 1) ||
    numBranch === 1
  ) {
    // # numBranch 추가한 이유: single 이지만 군이 여러개인 경우 때문.
    drugInfo = armG.interventionDescription[0];

    textStartX = armGLinePoint1.x + armGW + 0.1;
    testStartY = startPoint.y + startH / 2;
    let onlyDrugLineN = lineBreak(onlyDrug, intervenBranchLetterLimit)[0];
    for (let j = 0; j < drugInfo.length; j++) {
      // 브랜치 위에 있는 글자
      onlyDrugLineN = lineBreak(onlyDrug, intervenBranchLetterLimit)[0];
      if (onlyDrugLineN <= 2) {
        onlyDrug +=
          j + 1 === drugInfo.length
            ? drugInfo[j]["DrugName"]
            : drugInfo[j]["DrugName"] + "+";
      }
      drugDescription +=
        drugInfo[j]["DrugName"] + "(" + drugInfo[j]["Dosage"] + ") ";
      drugHowToTake = drugInfo[j]["HowToTake"];
    }
    if (onlyDrug.lastIndexOf("+") === onlyDrug.length - 1) {
      onlyDrug = onlyDrug.substring(0, onlyDrug.length - 1);
    }

    res = countLine(drugDescription, 45);
    drugDescription = res[1];
    onlyDrug = lineBreak(onlyDrug, intervenBranchLetterLimit)[1]; // 길이에 맞춰 다음줄로 넘기기
    let hoverText = drugDescription + ": " + drugHowToTake + "<br>"; // 약물에 대한 상세정보 text
    if(interventionTypeList != null){

      let intervenType = interventionTypeList[0] // intervention type을 알기 위함
      
      // drug가 추출 안 된 경우: drug type인데 빈 배열인 경우
      if (drugInfo.length === 0 && intervenType === "Drug") {
        onlyDrug = "empty";
        hoverText = "None";
      }
      // 해당 타입에서 약물이 사용되지 않는 경우: drug type이 아닌데 빈 배열인 경우
      if (drugInfo.length === 0 && intervenType !== "Drug") {
        onlyDrug = "no drug";
        hoverText = "None";
      }
    }

    let interObj = {
      x: textStartX,
      y: startPoint.y + startH / 2,
      xanchor: "left",
      yanchor: "bottom",
      align: "left",
      text:
        "<a href='#armgroup' target='_self' style='color:black;'>" +
        onlyDrug +
        "</a>",
      name: {
        type: "armGroup",
        inJson: "DrugName",
        idx: drugNameIdx++,
      },
      font: {
        size: intervenFontSize,
      },
      showarrow: false,
      hovertext: hoverText,
      hoverlabel: {
        bgcolor: "rgba(0,0,0,0.1)",
        bordercolor: "rgba(0,0,0,0.1)",
        font: {
          size: intervenHoverFontSize,
          color: "black",
        },
      },
    };
    annotations.push(interObj);

    let interDur = {
      x: textStartX + armGArrowW,
      y: testStartY,
      xanchor: "right",
      yanchor: "top",
      align: "right",
      text: drugInfo[0]["Duration"],
      name: {
        type: "armGroup",
        inJson: "Duration",
        idx: durationIdx++,
      },
      font: {
        size: intervenDurFontSize,
      },
      showarrow: false,
    };
    annotations.push(interDur);
  }
  else if ((designModel === "Crossover Assignment") & (numBranch === 2)) {
    for (let i = 0; i < numBranch; i++) {
      drugDescription = "";
      onlyDrug = "";
      drugInfo = armG.interventionDescription[i];
      for (let j = 0; j < drugInfo.length; j++) {
        onlyDrug +=
          j + 1 === drugInfo.length
            ? drugInfo[j]["DrugName"]
            : drugInfo[j]["DrugName"] + "+";
        drugDescription +=
          drugInfo[j]["DrugName"] +
          "(" +
          drugInfo[j]["Dosage"] +
          ") : " +
          drugHowToTake +
          "<br>";
      }

      drugDescription = countLine(drugDescription, intervenHoverLetterLimit)[1];
      onlyDrug = lineBreak(onlyDrug, intervenBranchLetterLimit)[1];
      if(interventionTypeList != null){
        let intervenType = interventionTypeList[i] // intervention type을 알기 위함
  
        // drug가 추출 안 된 경우: drug type인데 빈 배열인 경우
        if (drugInfo.length === 0 && intervenType === "Drug") {
          onlyDrug = "empty";
          drugDescription = "None";
        }
        // 해당 타입에서 약물이 사용되지 않는 경우: drug type이 아닌데 빈 배열인 경우
        if (drugInfo.length === 0 && intervenType !== "Drug") {
          onlyDrug = "no drug";
          drugDescription = "None";
        }
      }
      // 꼬기 전
      let interObjB = {
        x: armGLinePoint1.x + armGW + 0.1,
        y: startPoint.y + startH - i * (startH / (numBranch - 1)),
        xanchor: "left",
        yanchor: "bottom",
        align: "left",
        text:
          "<a href='#armgroup' target='_self' style='color:black;'>" +
          onlyDrug +
          "</a>",
        name: {
          type: "armGroup",
          inJson: "DrugName",
          idx: drugNameIdx++,
        },
        font: {
          size: intervenFontSize,
        },
        hovertext: drugDescription,
        hoverlabel: {
          bgcolor: "rgba(0,0,0,0.1)",
          bordercolor: "rgba(0,0,0,0.1)",
          font: {
            size: intervenHoverFontSize,
            color: "black",
          },
        },
        showarrow: false,
      };
      annotations.push(interObjB);
    }

    //write timeline
    let bfWashPoint = armGLinePoint1.x + armGW + armGArrowW / 3;
    let afWashPoint = armGLinePoint1.x + armGW + (armGArrowW / 3) * 2;

    // crossover timeline: font size
    const timeObjFontSize = 9;

    let timeObjBf = {
      x: (armGLinePoint1.x + bfWashPoint) / 2,
      y: washH,
      yanchor: "top",
      align: "middle",
      text: countLine(armG.interventionDescription[0][0]["Duration"], 15)[1],
      name: {
        type: "armGroup",
        inJson: "Duration",
        idx: durationIdx++,
      },
      font: {
        size: timeObjFontSize,
      },
      showarrow: false,
    };

    let timeObjM = {
      x: (bfWashPoint + afWashPoint) / 2,
      y: washH,
      yanchor: "bottom",
      text: "Washout period",
      font: {
        size: timeObjFontSize,
      },
      showarrow: false,
    };

    let washoutPeriod = intervention.washoutPeriod;

    let timeObjM2 = {
      x: (bfWashPoint + afWashPoint) / 2,
      y: washH,
      yanchor: "top",
      align: "left",
      text: countLine(washoutPeriod, 15)[1],
      font: {
        size: timeObjFontSize,
      },
      showarrow: false,
      name: {
        type: "intervention",
        inJson: "WashoutPeriod",
      },
    };

    let timeObjAf = {
      x: (afWashPoint + armGLinePoint1.x + armGW + armGArrowW) / 2,
      y: washH,
      yanchor: "top",
      align: "middle",
      text: countLine(armG.interventionDescription[1][0]["Duration"], 15)[1],
      name: {
        type: "armGroup",
        inJson: "Duration",
        idx: durationIdx++,
      },
      font: {
        size: timeObjFontSize,
      },
      showarrow: false,
    };
    annotations.push(timeObjBf, timeObjM, timeObjM2, timeObjAf);
  } else if (designModel[0] === "c" && designModel[2] === "p") {
    textStartX = armGLinePoint1.x + armGW + 0.1;
    testStartY = startPoint.y + startH - 0.1;
    const crossover = Number(designModel[1]);
    for (let i = 0; i < numBranch; i++) {
      drugDescription = "";
      onlyDrug = "";
      drugInfo = armG.interventionDescription[i];
      for (let j = 0; j < drugInfo.length; j++) {
        onlyDrug +=
          j + 1 === drugInfo.length
            ? drugInfo[j]["DrugName"]
            : drugInfo[j]["DrugName"] + "+";
        drugDescription +=
          drugInfo[j]["DrugName"] +
          "(" +
          drugInfo[j]["Dosage"] +
          ") : " +
          drugHowToTake +
          "<br>";
      }

      drugDescription = countLine(drugDescription, intervenHoverLetterLimit)[1];
      onlyDrug = lineBreak(onlyDrug, intervenBranchLetterLimit)[1];
      if(interventionTypeList != null){
        let intervenType = interventionTypeList[i] // intervention type을 알기 위함
  
        // drug가 추출 안 된 경우: drug type인데 빈 배열인 경우
        if (drugInfo.length === 0 && intervenType === "Drug") {
          onlyDrug = "empty";
          drugDescription = "None";
        }
        // 해당 타입에서 약물이 사용되지 않는 경우: drug type이 아닌데 빈 배열인 경우
        if (drugInfo.length === 0 && intervenType !== "Drug") {
          onlyDrug = "no drug";
          drugDescription = "None";
        }
      }

      let interObj = {
        x: armGLinePoint1.x + armGW + 0.1,
        y: startPoint.y + startH - i * (startH / (numBranch - 1)),
        xanchor: "left",
        yanchor: "bottom",
        align: "left",
        text:
          "<a href='#armgroup' target='_self' style='color:black;'>" +
          onlyDrug +
          "</a>",
        name: {
          type: "armGroup",
          inJson: "DrugName",
          idx: drugNameIdx++,
        },
        font: {
          size: intervenFontSize,
        },
        hovertext: drugDescription,
        hoverlabel: {
          bgcolor: "rgba(0,0,0,0.1)",
          bordercolor: "rgba(0,0,0,0.1)",
          font: {
            size: intervenHoverFontSize,
            color: "black",
          },
        },
        showarrow: false,
        captureevents: true,
      };

      annotations.push(interObj);
    }
    for (let j = 1; j < crossover; j += 2) {
      for (let i = 0; i < 2; i++) {
        let interDur = {
          x: textStartX + armGArrowW,
          y:
            testStartY -
            (1 - i) * (startH / (numBranch - 1)) +
            (yRange[1] - yRange[0]) / 20,
          xanchor: "right",
          yanchor: "bottom",
          align: "left",
          text: armG.interventionDescription[i + j - 1][0]["Duration"],
          name: {
            type: "armGroup",
            inJson: "Duration",
            idx: durationIdx++,
          },
          font: {
            size: intervenDurFontSize,
          },
          showarrow: false,
        };
        annotations.push(interDur);
      }
    }
    for (let i = crossover; i < numBranch; i++) {
      let interDur = {
        x: textStartX + armGArrowW,
        y:
          testStartY -
          i * (startH / (numBranch - 1)) +
          (yRange[1] - yRange[0]) / 20,
        xanchor: "right",
        yanchor: "bottom",
        align: "left",
        text: armG.interventionDescription[i][0]["Duration"],
        name: {
          type: "armGroup",
          inJson: "Duration",
          idx: durationIdx++,
        },
        font: {
          size: intervenDurFontSize,
        },
        showarrow: false,
      };
      annotations.push(interDur);
    }
  } else {
    // parallel, sequential...
    // limit number of branch
    let numBranchLimit = numBranch;
    if (numBranch > 6) {
      numBranchLimit = 6;
    }

    const columData = [];
    for (let i = 0; i < numBranchLimit; i++) {
      drugInfo = armG.interventionDescription[i];
      drugDescription = "";
      textStartX = armGLinePoint1.x + armGW + 0.1;
      testStartY = startPoint.y + startH - 0.1;
      onlyDrug = "";

      if (drugInfo.length !== 0) {
        let onlyDrugLineN = lineBreak(onlyDrug, intervenBranchLetterLimit)[0];
        for (let j = 0; j < drugInfo.length; j++) {
          // 브랜치 위에 있는 글자
          onlyDrugLineN = lineBreak(onlyDrug, intervenBranchLetterLimit)[0];
          if (onlyDrugLineN <= 2) {
            onlyDrug +=
              j + 1 === drugInfo.length
                ? drugInfo[j]["DrugName"]
                : drugInfo[j]["DrugName"] + "+";
          }

          // hover event's content
          drugDescription +=
            drugInfo[j]["DrugName"] +
            "(" +
            drugInfo[j]["Dosage"] +
            ") : " +
            drugHowToTake +
            "<br>";

          // 오버 이벤트 안에 있는 글자
          columData.push({
            DrugName: drugInfo[j]["DrugName"],
            Dosage: drugInfo[j]["Dosage"],
            HowToTake: drugInfo[j]["HowToTake"],
            Duration: drugInfo[j]["Duration"],
          });
        }
        onlyDrug = lineBreak(onlyDrug, intervenBranchLetterLimit)[1];

        //make letter object
        let interObj = {
          x: textStartX,
          y: startPoint.y + startH - i * (startH / (numBranchLimit - 1)),
          xanchor: "left",
          yanchor: "bottom",
          align: "left",
          text:
            "<a href='#armgroup' target='_self' style='color:black;'>" +
            onlyDrug +
            "</a>",
          name: {
            type: "armGroup",
            inJson: "DrugName",
            idx: drugNameIdx++,
          },
          font: {
            size: intervenFontSize,
          },
          hovertext: drugDescription,
          hoverlabel: {
            bgcolor: "rgba(0,0,0,0.1)",
            bordercolor: "rgba(0,0,0,0.1)",
            font: {
              size: intervenHoverFontSize,
              color: "black",
            },
          },
          showarrow: false,
          captureevents: true,
        };


        let interDur = {
          x: textStartX + armGArrowW,
          y:
            testStartY -
            i * (startH / (numBranchLimit - 1)) +
            (yRange[1] - yRange[0]) / 20,
          xanchor: "right",
          yanchor: "bottom",
          align: "left",
          text: armG.interventionDescription[i][0]["Duration"],
          name: {
            type: "armGroup",
            inJson: "Duration",
            idx: durationIdx++,
          },
          font: {
            size: intervenDurFontSize,
          },
          showarrow: false,
        };
        annotations.push(interObj, interDur);

      }
      // drugInfo의 길이가 0인 경우
      else {
        if(interventionTypeList != null){
          let intervenType = interventionTypeList[i] // intervention type을 알기 위함
  
          // drug가 추출 안 된 경우: drug type인데 빈 배열인 경우
          if (drugInfo.length === 0 && intervenType === "Drug") {
            onlyDrug = "empty";
            drugDescription = "None";
          }
          // 해당 타입에서 약물이 사용되지 않는 경우: drug type이 아닌데 빈 배열인 경우
          if (drugInfo.length === 0 && intervenType !== "Drug") {
            onlyDrug = "no drug";
            drugDescription = "None";
          }
        }

        let interObj = {
          x: textStartX,
          y: startPoint.y + startH - i * (startH / (numBranch - 1)),
          xanchor: "left",
          yanchor: "bottom",
          align: "left",
          text:
            "<a href='#armgroup' target='_self' style='color:black;'>" +
            onlyDrug +
            "</a>",
          name: {
            type: "armGroup",
            inJson: "DrugName",
            idx: drugNameIdx++,
          },
          font: {
            size: intervenFontSize,
          },
          hovertext: drugDescription,
          hoverlabel: {
            bgcolor: "rgba(0,0,0,0.1)",
            bordercolor: "rgba(0,0,0,0.1)",
            font: {
              size: intervenHoverFontSize,
              color: "black",
            },
          },
          showarrow: false,
          captureevents: true,
        };
        let interDur = {
          x: textStartX + armGArrowW - 1.3,
          y:
            testStartY -
            i * (startH / (numBranchLimit - 1)) +
            (yRange[1] - yRange[0]) / 20,
          xanchor: "left",
          yanchor: "bottom",
          align: "left",
          text: "empty",
          name: {
            type: "armGroup",
            inJson: "Duration",
            idx: durationIdx++,
          },
          font: {
            size: intervenDurFontSize,
          },
          showarrow: false,
        };
        annotations.push(interObj, interDur);
      }
    }
  }

  return { layout: annotations };
}
