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

export function drawPopulation(startPoint, startW, population) {
  let condition = population.condition;
  let gender = population.gender;
  let healthyCondition = population.healthyCondition;
  let maxAge = population.maxAge;
  let minAge = population.minAge;

  const dy = 0.06; //위치 조절량

  //높이 구하기
  let [cLine, conditionText] = countLine("<b>Condition:</b> " + condition, 20);
  let height = (cLine + 3) / 15;

  gender = "<b>Gender:</b> " + gender;
  healthyCondition = "<b>Healthy condition:</b> " + healthyCondition;
  maxAge = "<b>Max age:</b> " + maxAge;
  minAge = "<b>Min age:</b> " + minAge;


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
        x: startPoint.x,
        y: startPoint.y + height,
        xanchor: 'left',
        yanchor: 'top',
        align: 'left',
        text: conditionText,
        showarrow: false,
        name: ['population', 'condition'],
        font: {
          size: 11,
        }
      },
      {
        x: startPoint.x,
        y: startPoint.y + height - cLine * dy,
        xanchor: 'left',
        yanchor: 'top',
        align: 'left',
        text: gender,
        showarrow: false,
        name: ['population', 'gender'],
        font: {
          size: 11,
        }
      },
      {
        x: startPoint.x,
        y: startPoint.y + height - ++cLine * dy,
        xanchor: 'left',
        yanchor: 'top',
        align: 'left',
        text: healthyCondition,
        showarrow: false,
        name: ['population', 'healthyCondition'],
        font: {
          size: 11,
        }
      },
      {
        x: startPoint.x,
        y: startPoint.y + height - ++cLine * dy,
        xanchor: 'left',
        yanchor: 'top',
        align: 'left',
        text: minAge,
        showarrow: false,
        name: ['population', 'minAge'],
        font: {
          size: 11,
        }
      },{
        x: startPoint.x,
        y: startPoint.y + height - ++cLine * dy,
        xanchor: 'left',
        yanchor: 'top',
        align: 'left',
        text: maxAge,
        showarrow: false,
        name: ['population', 'maxAge'],
        font: {
          size: 11,
        }
      },]
    },
    startH: height,
  };
}
