export function drawPreIntervention(numberPoint, numberW, allocationPoint, radius, moseekH, intervention) {
  const masking = intervention.masking
  const enrollment = intervention.enrollment
  const allocation = intervention.allocation
  const ratio = intervention.ratio

  const deltaRadius = 15 / moseekH; // 그림 비율에 맞춰 자동으로 찌그러짐정도 정해지도록
  const delta = 0.1 / 2;
  const widthTrianlge = 0.02;
  const heightTriangle = 0.5

  // ax.text(allocationPoint.x-radius, allocationPoint.y+radius+0.1, intervention.ratio)
  return {
    layout: {
      shapes: [
        {
          type: "line",
          x0: numberPoint.x,
          y0: numberPoint.y,
          x1: numberPoint.x + numberW - (heightTriangle - 0.1), //끝에 화살표 만들려고 길이 살짝 뺌
          y1: numberPoint.y,
          line: {
            width: 5
          }
        },
        {
          type: 'path',
          path: `M ${numberPoint.x + numberW - heightTriangle} ${numberPoint.y} V ${numberPoint.y + widthTrianlge} 
                L ${numberPoint.x + numberW} ${numberPoint.y} L ${numberPoint.x + numberW - heightTriangle} ${numberPoint.y - widthTrianlge} Z`,
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
        },],
      annotations: [
        { //maksing
          x: numberPoint.x + numberW / 2,
          y: numberPoint.y - delta,
          text: "<a href='#studydesign' target='_self' style='color:black;'>"+'M=' + masking+"</a>",
          showarrow: false,
          font: {
            size: 10
          },

        },
        { //enrollment
          x: numberPoint.x + numberW / 2,
          y: numberPoint.y + delta,
          text: "<a href='#studydesign' target='_self' style='color:black;'>"+'N=' + enrollment+"</a>",
          showarrow: false,
          font: {
            size: 10
          },

        },
        { //allocation
          x: allocationPoint.x,
          y: allocationPoint.y,
          text: "<a href='#studydesign' target='_self' style='color:black;'>"+allocation[0]+"</a>",
          showarrow: false,

        },
        {// ratio
          x: allocationPoint.x,
          y: allocationPoint.y + radius / deltaRadius,
          yanchor: "bottom",
          text: "<a href='#armgroup' target='_self' style='color:black;'>"+ratio+"</a>",
          font: {
            size: 7
          },
          showarrow: false,
          name: {
            type: 'intervention',
            inJson: 'PopulationRatio',
          }
        },

      ]
    }
  };
}


