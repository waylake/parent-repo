import Plot from "react-plotly.js";

export function countLine(inString, limit) {
  var point = 0;
  var slist = [];
  while (inString.length > limit) {
    point = inString.slice(0, limit).lastIndexOf("\u00a0");
    if (point == -1) {
      slist.push(inString.slice(0, limit));
      inString = inString.slice(limit);
    } else {
      slist.push(inString.slice(0, point + 1));
      inString = inString.slice(point + 1);
    }
  }
  slist.push(inString);
  let n = slist.length;
  return [n, slist];
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
  let result = countLine(condition, 48);
  let cLine = result[0];
  let textList = result[1];
  console.log("cLine" + cLine);
  console.log("textList" + textList);
  let height = (cLine + 5) / 10 + 0.1;

  let textX = startPoint.x + dx;
  let textYList = [startPoint.y + height];
  for (let i = 0; i < textList.length + 4; i++) {
    let baseTextY = startPoint.y + height - cLine * dy - 0.05;
    textYList.push(baseTextY - dy * i);
  }

  //박스그리기
  return {
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
          x: [startPoint.x + startW / 2 - 1, textX, textX, textX, textX, textX],
          y: textYList,
          text: [
            "Population",
            "Condition: " + condition,
            "Gender: " + gender,
            "Healthy condition: " + healthyCondition,
            "minAge: " + minAge,
            "maxAge: " + maxAge,
          ],
        },
      ],
    },
    startH: height,
  };
}
