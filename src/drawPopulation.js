import { pushListElement, pushSameElement } from "./pushElements";

export function countLine(inString, limit) {
  let point = 0;
  let brString = [];
  let n = 0;
  while (inString.length > limit) {
    n++;
    point = inString.slice(0, limit).lastIndexOf(" ");
    if (point === -1) {
      brString += inString.slice(0, limit) + '<br>';
      inString = inString.slice(limit);
    } else {
      brString += inString.slice(0, point) + '<br>';
      inString = inString.slice(point + 1);
    }
  }
  n++;
  brString += inString;

  return [n, brString];
}

// export function countLine(inString, limit) {
//   let point = 0;
//   let brString = [];
//   let n = 0;
//   while (inString.length > limit) {
//     n++;
//     point = inString.slice(0, limit).lastIndexOf(" ");
//     if (point === -1) {
//       brString += inString.slice(0, limit) + '<br>';
//       inString = inString.slice(limit);
//     } else {
//       brString += inString.slice(0, point) + '<br>';
//       inString = inString.slice(point + 1);
//     }
//   }
//   n++;
//   brString += inString;
//   return [n, brString];
// }

export function stringGoDown(inString, limit, datalst, startPoint, delta) {
  let result = countLine(inString, limit);
  let cLine = result[0];
  let getTextList = result[1];

  let giveList = [];
  for (let i = 0; i < datalst.length; i++) {
    let baseLoc = startPoint.y - delta * i;
    giveList.push(baseLoc);
  }
  return giveList;
}

export function drawPopulation(startPoint, startW, box, population) {
  const condition = population.condition;
  const gender = population.gender;
  const healthyCondition = population.healthyCondition;
  const maxAge = population.maxAge;
  const minAge = population.minAge;

  let dx = 0.1;
  let dy = 0.1; //위치 조절량

  //높이 구하기
  let result = countLine("Condition: " + condition, 20);
  let cLine = result[0];
  let contidionTextList = result[1];
  let height = (cLine + 3) / 10;

  let textX = startPoint.x + dx;
  let textYList = [];
  for (let i = 0; i < contidionTextList.length + 4; i++) {
    let baseTextY = startPoint.y + height - cLine * dy * 0.3 - 0.005;
    textYList.push(baseTextY - dy * i * 0.6);
  }
  let textXList = [];
  pushSameElement(textXList, textX, contidionTextList.length, 4);

  let popContent = [];
  pushListElement(popContent, contidionTextList, 0);
  popContent.push(
    "Gender: " + gender,
    "Healthy condition: " + healthyCondition,
    "minAge: " + minAge,
    "maxAge: " + maxAge
  );

  return {
    data: [
      {
        x: textXList,
        y: textYList,
        text: popContent,
        textfont: {
          color: "black",
          size: 11.5,
        },
        mode: "text",
        textposition: "top right",
      },
      {
        x: [startPoint.x + startW / 2],
        y: [startPoint.y + height + 0.02],
        text: ["Population"],
        textfont: {
          color: "black",
          size: 15,
        },
        mode: "text",
      },
    ],
    layout: {
      shapes: [
        {
          type: "rect",
          // xref: "x",
          // yref: "y",
          // fillcolor: "rgba(50, 171, 96, 0.7)",
          x0: startPoint.x,
          y0: startPoint.y,
          x1: startPoint.x + startW,
          y1: startPoint.y + height,
          line: {
            color: "rgba(140, 140, 255, 1)",
          },
        },
      ],
      annotation: {

      }
    },
    startH: height,
  };
}
