import { countLine } from "./drawPopulation";

export function writeIntervention(
  startPoint,
  startH,
  armGLinePoint1,
  armGW,
  armGArrowW,
  designModel,
  armG,
  intervention
) {
  let numBranch = armG.interventionDescription.length;
  let annotations = [];
  let drugDescription = "";
  let textStartX;
  let testStartY;
  let drugInfo;

  let res;
  let lineNum;

  if ((designModel === "Single Group Assignment" && numBranch === 1) || numBranch === 1 ){
    // # numBranch 추가한 이유: single 이지만 군이 여러개인 경우 때문.
    drugInfo = armG.interventionDescription[0];
    textStartX = armGLinePoint1.x + armGW + 0.1;
    testStartY = startPoint.y + startH / 2;
    for (let i = 0; i < drugInfo.length; i++) {
      drugDescription += drugInfo[i]["DrugName"] + "(" + drugInfo[i]["Dosage"] + ") ";
    }
    res = countLine(drugDescription, 40);
    drugDescription = res[1];
    lineNum = res[0];

    let interObj = {
      x: armGLinePoint1.x,
      y: startPoint.y + startH / 2 + 0.08 * lineNum,
      xanchor: "left",
      yanchor: "top",
      align: "left",
      text: drugDescription,
      font: {
        size: 12,
      },
      showarrow: false,
    };
    annotations.push(interObj);

    let interDur = {
      x: textStartX + armGArrowW - 1,
      y: testStartY,
      xanchor: "left",
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
      drugInfo = armG.interventionDescription[i];
      for (let j = 0; j < drugInfo.length; j++) {
        drugDescription += drugInfo[j]["DrugName"] + "(" + drugInfo[j]["Dosage"] + ") ";
      }

      drugDescription = countLine(drugDescription, 15)[1];
      // 꼬기 전
      let interObjB = {
        x: armGLinePoint1.x + armGW + 0.1,
        y: startPoint.y + startH - i * ((startH) / (numBranch - 1)),
        xanchor: "left",
        yanchor: "bottom",
        align: "left",
        text: drugDescription,
        font: {
          size: 10,
        },
        showarrow: false,
      }
      annotations.push(interObjB);
      
      let interObjA = {
        x: armGLinePoint1.x + armGArrowW/3*2+1,
        y: startPoint.y + i * ((startH) / (numBranch - 1)),
        xanchor: "left",
        yanchor: "bottom",
        align: "left",
        text: drugDescription,
        font: {
          size: 10,
        },
        showarrow: false,
      }
      annotations.push(interObjA);
    }
    
    //write timeline
    let bfWashPoint = armGLinePoint1.x + armGW + armGArrowW / 3;
    let afWashPoint = armGLinePoint1.x + armGW  + armGArrowW / 3 * 2;
    let washH = armGLinePoint1.y - startH / 2 - 0.33;
    
    let timeObjB = {
      x: (armGLinePoint1.x+bfWashPoint)/2,
      y: washH,
      // xanchor: "left",
      yanchor: "bottom",
      align: "left",
      text: armG.interventionDescription[0][0]['Duration'],
      font: {
        size: 9,
      },
      showarrow: false,
    }
    annotations.push(timeObjB);

    let timeObjM = {
      x: (bfWashPoint+afWashPoint)/2,
      y: washH+0.05,
      // xanchor: "left",
      yanchor: "bottom",
      // align: "left",
      text: "Washout period",
      font: {
        size: 9,
      },
      showarrow: false,
    }
    annotations.push(timeObjM);

    let timeObjM2 = {
      x: (bfWashPoint+afWashPoint)/2,
      y: washH,
      // xanchor: "left",
      yanchor: "bottom",
      align: "left",
      text: intervention.washout_period,
      font: {
        size: 9,
      },
      showarrow: false,
    }
    annotations.push(timeObjM2);
    
    let timeObjA = {
      x: (afWashPoint+armGLinePoint1.x+armGW+armGArrowW)/2,
      y: washH-0.1,
      xanchor: "left",
      yanchor: "bottom",
      align: "left",
      text: armG.interventionDescription[1][0]['Duration'],
      font: {
        size: 9,
      },
      showarrow: false,
    }
    annotations.push(timeObjA);
  }else{ // parallel, sequential...
    

  }


  return {layout: annotations}
}
