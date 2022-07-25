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

export function drawPopulation(startPoint, startW, box, population) {
  const condition = population.condition;
  const gender = population.gender;
  const healthyCondition = population.healthyCondition;
  const maxAge = population.maxAge;
  const minAge = population.minAge;

  let dx = 0.1;
  let dy = 0.1; //위치 조절량

  //높이 구하기
  let result = countLine("<b>Condition:</b> " + condition, 20);
  let cLine = result[0];
  let conditionText = result[1];
  let height = (cLine + 3) / 10;

  let popContent = "" + conditionText + "<br>";
  popContent += "<b>Gender:</b> " + gender + "<br>"
  popContent += "<b>Healthy condition:</b> " + healthyCondition + "<br>"
  popContent += "<b>minAge:</b> " + minAge + "<br>"
  popContent += "<b>maxAge:</b> " + maxAge + "<br>"

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
        },
      ],
      annotations: [{
        // xref: "paper",
        // yref: "paper",
        x: startPoint.x,
        y: startPoint.y + height,
        xanchor: 'left',
        yanchor: 'top',
        align: 'left',
        text: popContent,
        showarrow: false,
        font: {
          size: 11,
        }
      }]
    },
    startH: height,
  };
}
