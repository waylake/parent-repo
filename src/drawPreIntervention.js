import Plot from "react-plotly.js";
import { countLine } from "./drawPopulation";

export function drawPreIntervention(numberPoint, numberW, allocationPoint, radius, intervention) {
  const masking = intervention.masking
  const enrollment = intervention.enrollment
  const allocation = intervention.allocation
  const ratio = intervention.ratio

  const deltaRadius = 7;
  const deltaTrianlge = 0.04;

  const brMasking = countLine('M=' + masking, 6)[1];
  console.log(brMasking);
  // ax.text(allocationPoint.x-radius, allocationPoint.y+radius+0.1, intervention.ratio)
  return {
    data: [// masking, enrollment, allocation, ratio 순서
      {
        x: [numberPoint.x + numberW / 2, numberPoint.x + numberW / 2, allocationPoint.x, allocationPoint.x],
        y: [numberPoint.y - 0.3, numberPoint.y + 0.1, allocationPoint.y, allocationPoint.y + radius],
        text: [masking, 'N=' + enrollment, allocation[0], ratio],
        textfont: {
          color: 'black',
        },
        mode: 'text',
      },
    ],
    layout: {
      shapes: [
        {
          type: "line",
          x0: numberPoint.x,
          y0: numberPoint.y,
          x1: numberPoint.x + numberW - 1, //끝에 화살표 만들려고 길이 살짝 뺌
          y1: numberPoint.y,
          line: {
            width: 10
          }
        },
        {
          type: 'path',
          path: `M ${numberPoint.x + numberW - 1} ${numberPoint.y} V ${numberPoint.y + deltaTrianlge} 
                L ${numberPoint.x + numberW} ${numberPoint.y} L ${numberPoint.x + numberW - 1} ${numberPoint.y - deltaTrianlge} Z`,
          fillcolor: 'rgb(0,0,0)',
        },
        {
          type: "circle",
          x0: allocationPoint.x - radius,
          y0: allocationPoint.y - radius / deltaRadius,
          x1: allocationPoint.x + radius,
          y1: allocationPoint.y + radius / deltaRadius,
          fillcolor: 'rgba(201, 205, 212, 0.5)',
          line: {
            color: 'rgba(201, 205, 212, 0)'
          }
        },]
    }
  };
}


