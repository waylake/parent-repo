import { countLine } from "./drawPopulation";
import {lineBreak} from "./drawInfoTrial"

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

  const intervenFontSize = 12;
  const intervenDurFontSize = 9;
  const intervenHoverFontSize = 13;

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
        i + 1 === drugInfo.length
          ? drugInfo[i]["DrugName"]
          : drugInfo[i]["DrugName"] + "+";
      drugDescription +=
        drugInfo[i]["DrugName"] + "(" + drugInfo[i]["Dosage"] + ") ";
      drugHowToTake = drugInfo[i]["HowToTake"];
    }
    res = countLine(drugDescription, 45);
    drugDescription = res[1];
    onlyDrug = lineBreak(onlyDrug, 32)[1];

    let interObj = {
      x: textStartX,
      y: startPoint.y + startH / 2,
      xanchor: "left",
      yanchor: "bottom",
      align: "left",
      text: onlyDrug,
      name: ["armGroup", "DrugName"],
      font: {
        size: intervenFontSize,
      },
      showarrow: false,
      hovertext: drugDescription + ": " + drugHowToTake + "<br>",
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
      name: ["armGroup", "Duration"],
      font: {
        size: intervenDurFontSize,
      },
      showarrow: false,
    };
    annotations.push(interDur);
  } else if (
    (designModel === "Crossover Assignment") &
    (typeof intervention.washoutPeriod == "String") &
    (numBranch === 2)
  ) {
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

      drugDescription = countLine(drugDescription, 15)[1];
      onlyDrug = lineBreak(onlyDrug, 32)[1];
      // 꼬기 전
      let interObjB = {
        x: armGLinePoint1.x + armGW + 0.1,
        y: startPoint.y + startH - i * (startH / (numBranch - 1)),
        xanchor: "left",
        yanchor: "bottom",
        align: "left",
        text: onlyDrug,
        name: ["armGroup", "DrugName"],
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
      // 꼰 후
      let interObjA = {
        x: armGLinePoint1.x + (armGArrowW / 3) * 2 + 1,
        y: startPoint.y + i * (startH / (numBranch - 1)),
        xanchor: "left",
        yanchor: "bottom",
        align: "left",
        text: onlyDrug,
        name: ["armGroup", "DrugName"],
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
      annotations.push(interObjB, interObjA);
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
      name: ["armGroup", "Duration"],
      font: {
        size: timeObjFontSize,
      },
      showarrow: false,
    };

    let timeObjM = {
      x: (bfWashPoint + afWashPoint) / 2,
      y: washH + 0.05,
      yanchor: "top",
      text: "Washout period",
      name: ["armGroup", "text"],
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
      name: ["intervention", "washoutPeriod"],
    };

    let timeObjAf = {
      x: (afWashPoint + armGLinePoint1.x + armGW + armGArrowW) / 2,
      y: washH,
      yanchor: "top",
      align: "middle",
      text: countLine(armG.interventionDescription[1][0]["Duration"], 15)[1],
      name: ["armGroup", "Duration"],
      font: {
        size: timeObjFontSize,
      },
      showarrow: false,
    };
    annotations.push(timeObjBf, timeObjM, timeObjM2, timeObjAf);
  } else {
    // limit number of branch
    let numBranchLimit = numBranch;
    if (numBranch > 6) {
      numBranchLimit = 6;
    }
    // parallel, sequential...
    for (let i = 0; i < numBranchLimit; i++) {
      drugInfo = armG.interventionDescription[i];
      drugDescription = "";
      onlyDrug = "";
      try {
        textStartX = armGLinePoint1.x + armGW + 0.1;
        testStartY = startPoint.y + startH - 0.1;
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
        onlyDrug = lineBreak(onlyDrug, 32)[1];

        //make letter object
        let interObj = {
          x: textStartX,
          y: startPoint.y + startH - i * (startH / (numBranchLimit - 1)),
          xanchor: "left",
          yanchor: "bottom",
          align: "left",
          text: onlyDrug,
          name: ["armGroup", "DrugName"],
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
        let interDur = {
          x: textStartX + armGArrowW,
          y:
            testStartY -
            i * (startH / (numBranchLimit - 1)) +
            (yRange[1] - yRange[0]) / 20,
          xanchor: "right",
          yanchor: "bottom",
          align: "left",
          text: armG.interventionDescription[1][0]["Duration"],
          name: ["armGroup", "Duration"],
          font: {
            size: intervenDurFontSize,
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
          name: ["armGroup", "drug"],
          font: {
            size: intervenFontSize,
          },
          showarrow: false,
        };
        let interDur = {
          x: textStartX + armGArrowW - 0.3,
          y:
            testStartY -
            i * (startH / (numBranchLimit - 1)) +
            (yRange[1] - yRange[0]) / 20,
          xanchor: "left",
          yanchor: "bottom",
          align: "left",
          text: armG.interventionDescription[1][0]["Duration"],
          name: ["armGroup", "Duration"],
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
