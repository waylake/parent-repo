export function countLine(inString, limit) {
  let point = 0;
  let brString = [];
  let n = 0;
  while (inString.length > limit) {
    n++;
    point = inString.slice(0, limit).lastIndexOf(" ");
    if (point === -1) {
      brString += inString.slice(0, limit) + "<br>";
      inString = inString.slice(limit);
    } else {
      brString += inString.slice(0, point) + "<br>";
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

  gender = "<b>Gender:</b> " + gender;
  healthyCondition = "<b>Healthy condition:</b> " + healthyCondition;
  minAge = "<b>Min age:</b> " + minAge;
  maxAge = "<b>Max age:</b> " + maxAge;
  const dy = 0.035; //위치 조절량

  //높이 구하기
  let [popLine, popText] = countLine(
    "<b>Condition:</b> " +
      condition +
      "<br>" +
      gender +
      "<br>" +
      healthyCondition +
      "<br>" +
      maxAge +
      "<br>" +
      minAge,
    30
  );

  let [cLine, conditionText] = countLine("<b>Condition:</b> " + condition, 25);
  let height = popLine / 20;
  // console.log(popLine);
  const popContentLimit = 28;
  let [genderLine, genderText] = countLine(gender, popContentLimit);
  let [healthyLine, healthyText] = countLine(healthyCondition, popContentLimit);
  let [minAgeLine, minAgeText] = countLine(minAge, popContentLimit);
  let [maxAgeLine, maxAgeText] = countLine(maxAge, popContentLimit);

  return {
    layout: {
      shapes: [
        {
          type: "rect",
          x0: startPoint.x,
          y0: startPoint.y,
          x1: startPoint.x + startW,
          y1: startPoint.y + height,
          line: {
            color: "rgba(140, 140, 255, 1)",
          },
        },
      ],
      annotations: [
        {
          x: startPoint.x + startW / 2,
          y: startPoint.y + height * 1.06,
          align: "middle",
          text: "<b>Population</b>",
          // bordercolor: "gray",
          showarrow: false,
          name: "Population",
          font: {
            size: 13,
          },
        },
        {
          x: startPoint.x,
          y: startPoint.y + height,
          xanchor: "left",
          yanchor: "top",
          align: "left",
          text:
            "<a href='#studydesc' target='_self' style='color:black;'>" +
            conditionText +
            "</a>",
          showarrow: false,
          name: {
            type: "PopulationBox",
            inJson: "Condition",
          },
          font: {
            size: 11,
          },
        },
        {
          x: startPoint.x,
          y: startPoint.y + height - cLine * dy,
          xanchor: "left",
          yanchor: "top",
          align: "left",
          text:
            "<a href='#eligibility' target='_self' style='color:black;'>" +
            genderText +
            "</a>",
          showarrow: false,
          name: {
            type: "PopulationBox",
            inJson: "Gender",
          },
          font: {
            size: 11,
          },
        },
        {
          x: startPoint.x,
          y: startPoint.y + height - (cLine + genderLine) * dy,
          xanchor: "left",
          yanchor: "top",
          align: "left",
          text:
            "<a href='#eligibility' target='_self' style='color:black;'>" +
            healthyText +
            "</a>",
          showarrow: false,
          name: {
            type: "PopulationBox",
            inJson: "HealthyCondition",
          },
          font: {
            size: 11,
          },
        },
        {
          x: startPoint.x,
          y: startPoint.y + height - (cLine + genderLine + healthyLine) * dy,
          xanchor: "left",
          yanchor: "top",
          align: "left",
          text:
            "<a href='#eligibility' target='_self' style='color:black;'>" +
            minAgeText +
            "</a>",
          showarrow: false,
          name: {
            type: "PopulationBox",
            inJson: "MinAge",
          },
          font: {
            size: 11,
          },
        },
        {
          x: startPoint.x,
          y:
            startPoint.y +
            height -
            (cLine + genderLine + healthyLine + minAgeLine) * dy,
          xanchor: "left",
          yanchor: "top",
          align: "left",
          text:
            "<a href='#eligibility' target='_self' style='color:black;'>" +
            maxAgeText +
            "</a>",
          showarrow: false,
          name: {
            prop: "PopulationBox",
            inJson: "MaxAge",
          },
          font: {
            size: 11,
          },
        },
      ],
    },
    startH: height,
  };
}
