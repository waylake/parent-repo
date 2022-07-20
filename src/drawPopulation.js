import Plot from "react-plotly.js";

function countLine(inString, limit) {
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
  return n;
}

export function drawPopulation(startPoint, startW, box, population) {
  const condition = population.condition;
  const gender = population.gender;
  const healthy_condition = population.healthy_condition;
  const maxAge = population.maxAge;
  const minAge = population.minAge;

  let dx = 0.1;
  let dy = 0.1; //위치 조절량

  //높이 구하기
  let cLine = countLine(condition, 48);
  let height = (cLine + 5) / 10 + 0.1;

  //박스그리기
  return (
    <Plot
      layout={{
        width: 600,
        height: 600,
        // xaxis: { color: "#FFF" },
        // yaxis: { color: "#FFF" },
        shapes: [
          {
            type: "rect",
            // xref: "x",
            // yref: "y",
            // fillcolor: "rgba(50, 171, 96, 0.7)",
            x0: startPoint.x,
            y0: startPoint.y,
            x1: startPoint.x + startW,
            y1: startPoint.y + startW,
            line: {
              color: "rgba(50, 171, 96, 1)",
            },
            text: "Population",
          },
        ],
      }}
    />
  );
}
