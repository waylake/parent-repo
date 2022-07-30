import { countLine } from "./drawPopulation";

export function writeIntervention(
  startPoint,
  startH,
  armGLinePoint1,
  armGW,
  armGArrowW,
  washH,
  designModel,
  armG,
  intervention
) {
  let numBranch = armG.interventionDescription.length;
  let annotations = [];
  let drugDescription = "";
  let drugHowToTake = "";
  let onlyDrug = "";
  let textStartX;
  let testStartY;
  let drugInfo;

  let res;

  if (
    (designModel === "Single Group Assignment" && numBranch === 1) ||
    numBranch === 1
  ) {
    // # numBranch 추가한 이유: single 이지만 군이 여러개인 경우 때문.
    drugInfo = armG.interventionDescription[0];
    textStartX = armGLinePoint1.x + armGW + 0.1;
    testStartY = startPoint.y + startH / 2;
    for (let i = 0; i < drugInfo.length; i++) {
      onlyDrug +=
        drugInfo[i]["DrugName"] + " ";
      drugDescription +=
        drugInfo[i]["DrugName"] + "(" + drugInfo[i]["Dosage"] + ") ";
      drugHowToTake = drugInfo[i]["HowToTake"];
    }
    res = countLine(drugDescription, 45);
    drugDescription = res[1];

    let interObj = {
      x: textStartX,
      y: startPoint.y + startH / 2,
      xanchor: "left",
      yanchor: "bottom",
      align: "left",
      text: onlyDrug,
      font: {
        size: 10,
      },
      showarrow: false,
      hovertext: drugDescription + ": " + drugHowToTake + "<br>",
      hoverlabel: {
        bgcolor: "rgba(0,0,0,0.1)",
        bordercolor: "rgba(0,0,0,0.1)",
        font: {
          size: 12,
          color: 'black',
        }
      }
    };
    annotations.push(interObj);

    let interDur = {
      x: textStartX + armGArrowW,
      y: testStartY,
      xanchor: "right",
      yanchor: "top",
      align: "right",
      text: drugInfo[0]["Duration"],
      font: {
        size: 9,
      },
      showarrow: false,
    };
    annotations.push(interDur);
  } else if (designModel === "Crossover Assignment") {
    for (let i = 0; i < numBranch; i++) {
      drugDescription = "";
      onlyDrug = "";
      drugInfo = armG.interventionDescription[i];
      for (let j = 0; j < drugInfo.length; j++) {
        onlyDrug += drugInfo[j]["DrugName"] + " ";
        drugDescription +=
          drugInfo[j]["DrugName"] + "(" + drugInfo[j]["Dosage"] + ") : " + drugHowToTake + "<br>";
      }

      drugDescription = countLine(drugDescription, 15)[1];
      // 꼬기 전
      let interObjB = {
        x: armGLinePoint1.x + armGW + 0.1,
        y: startPoint.y + startH - i * (startH / (numBranch - 1)),
        xanchor: "left",
        yanchor: "bottom",
        align: "left",
        text: onlyDrug,
        font: {
          size: 10,
        },
        hovertext: drugDescription,
        hoverlabel: {
          bgcolor: "rgba(0,0,0,0.1)",
          bordercolor: "rgba(0,0,0,0.1)",
          font: {
            size: 12,
            color: 'black',
          }
        },
        showarrow: false,
      };
      // 꼰 후
      let interObjA = {
        x: armGLinePoint1.x + (armGArrowW / 3) * 2 + 1,
        y: startPoint.y + i * (startH / (numBranch - 1)),
        xanchor: "left",
        yanchor: "bottom",
        align: "left",
        text: onlyDrug,
        font: {
          size: 10,
        },
        hovertext: drugDescription,
        hoverlabel: {
          bgcolor: "rgba(0,0,0,0.1)",
          bordercolor: "rgba(0,0,0,0.1)",
          font: {
            size: 12,
            color: 'black',
          }
        },
        showarrow: false,
      };
      annotations.push(interObjB, interObjA);
    }

    //write timeline
    let bfWashPoint = armGLinePoint1.x + armGW + armGArrowW / 3;
    let afWashPoint = armGLinePoint1.x + armGW + (armGArrowW / 3) * 2;


    let timeObjB = {
      x: (armGLinePoint1.x + bfWashPoint) / 2,
      y: washH,
      yanchor: "top",
      align: "left",
      text: armG.interventionDescription[0][0]["Duration"],
      font: {
        size: 9,
      },
      showarrow: false,
    };

    let timeObjM = {
      x: (bfWashPoint + afWashPoint) / 2,
      y: washH + 0.05,
      yanchor: "top",
      text: "Washout period",
      font: {
        size: 9,
      },
      showarrow: false,
    };

    let timeObjM2 = {
      x: (bfWashPoint + afWashPoint) / 2,
      y: washH,
      yanchor: "top",
      align: "left",
      text: "intervention.washout_period",   //예외 처리 필요
      font: {
        size: 9,
      },
      showarrow: false,
    };

    let timeObjA = {
      x: (afWashPoint + armGLinePoint1.x + armGW + armGArrowW) / 2,
      y: washH - 0.1,
      xanchor: "left",
      yanchor: "top",
      align: "left",
      text: armG.interventionDescription[1][0]["Duration"],
      font: {
        size: 9,
      },
      showarrow: false,
    };
    annotations.push(timeObjB, timeObjM, timeObjM2, timeObjA);
  } else {
    // parallel, sequential...
    for (let i = 0; i < numBranch; i++) {
      drugInfo = armG.interventionDescription[i];
      drugDescription = "";
      onlyDrug = "";
      try {
        textStartX = armGLinePoint1.x + armGW + 0.1;
        testStartY = startPoint.y + startH - 0.1;
        for (let j = 0; j < drugInfo.length; j++) {
          onlyDrug += drugInfo[j]["DrugName"] + " ";
          drugDescription +=
            drugInfo[j]["DrugName"] + "(" + drugInfo[j]["Dosage"] + ") : " + drugHowToTake + "<br>";
        }
        // drugDescription = countLine(drugDescription, 45)[1];

        //make letter object
        let interObj = {
          x: textStartX,
          y: startPoint.y + startH - i * (startH / (numBranch - 1)),
          xanchor: "left",
          yanchor: "bottom",
          align: "left",
          text: onlyDrug,
          font: {
            size: 10,
          },
          hovertext: drugDescription,
          hoverlabel: {
            bgcolor: "rgba(0,0,0,0.1)",
            bordercolor: "rgba(0,0,0,0.1)",
            font: {
              size: 12,
              color: 'black',
            }
          },
          showarrow: false,
        };
        let interDur = {
          x: textStartX + armGArrowW,
          y: testStartY - i * (startH / (numBranch - 1)) + 0.03,
          xanchor: "right",
          yanchor: "bottom",
          align: "left",
          text: armG.interventionDescription[1][0]["Duration"],
          font: {
            size: 9,
          },
          showarrow: false,
        };
        annotations.push(interObj, interDur);
      } catch {
        drugDescription = "No intervention";
        let interObj = {
          x: textStartX,
          y: startPoint.y + startH - i * (startH / (numBranch - 1)),
          xanchor: "left",
          yanchor: "bottom",
          align: "left",
          text: drugDescription,
          font: {
            size: 9,
          },
          showarrow: false,
        };
        let interDur = {
          x: textStartX + armGArrowW - 0.3,
          y: testStartY - i * (startH / (numBranch - 1)) - 0.01,
          xanchor: "left",
          yanchor: "bottom",
          align: "left",
          text: armG.interventionDescription[1][0]["Duration"],
          font: {
            size: 9,
          },
          showarrow: false,
        };
        annotations.push(interObj, interDur);
      }
    }
  }

  return { layout: annotations };
}
