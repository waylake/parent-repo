import { countLine } from "./drawPopulation";
import { Point } from "./Point";

export function drawInfoTrial(
  durationPoint,
  startPoint,
  startH,
  legendPoint,
  numArm,
  infoTrial
) {
  const [objectiveLine, objective] = countLine("Objective: " + infoTrial.objective, 87);
  const [titleLine, title] = countLine("Title: " + infoTrial.title, 75);
  const [officialTitleLine, officialTitle] = countLine("Official Title: " + infoTrial.officialTitle, 110);
  const completeTime = infoTrial.completeTime + " months<br>required to complete";
  // #objective
  const objPoint = new Point(startPoint.x, startPoint.y + startH + 0.1);

  // bboxString(ax, objPoint.x, objPoint.y, "Objective: " + infoTrial.objective, 130, 15, 1)



  // // # infoTrial.title
  const titlePoint = new Point(objPoint.x, objPoint.y + objectiveLine / 10);
  // bboxString(ax, titlePoint.x, titlePoint.y, "Title: "+ infoTrial.title, 100, 20, 1)

  // #complete_time


  // // # infoTrial.official title
  const officialPoint = new Point(startPoint.x, startPoint.y - startH / 2);
  // bboxString(ax, officialPoint.x, legendPoint.y - (numArm+1)*startH/3, "Official Title: " +  info_trial.official_title, 110, 15, 1)
  const yRange = [officialPoint.y - officialTitleLine / 10, titlePoint.y + titleLine / 10]
  return {
    data: [
      {
        x: [durationPoint.x, durationPoint.x],
        y: [durationPoint.y, durationPoint.y + startH * 4 / 3],
        mode: "lines",
        line: {
          color: "rgba(1,1,1,1)",
          width: 1,
        },
        showlegend: false,
        hoverinfo: 'skip', // branch 라인 위에 마우스 올렸을 때 데이터 보이지 않도록 설정
      },
    ],
    layout: {
      annotations: [
        { //objective
          x: objPoint.x,
          y: objPoint.y,
          text: objective,
          showarrow: false,
          xanchor: 'left',
          yanchor: "bottom",
          font: {
            size: 13,
          },
          bordercolor: '#c7c7c7',
          align: 'left',
          name: ['infoTrial', 'objective'],
          // captureevents: true,
        },
        { //title
          x: titlePoint.x,
          y: titlePoint.y,
          text: title,
          showarrow: false,
          xanchor: 'left',
          yanchor: "bottom",
          font: {
            size: 16,
          },
          bordercolor: '#c7c7c7',
          align: 'left',
          name: ['infoTrial', 'title'],
          // captureevents: true,
        },
        { // official title
          x: officialPoint.x,
          y: legendPoint.y - startH / 3,
          text: officialTitle,
          showarrow: false,
          xanchor: 'left',
          yanchor: 'top',
          font: {
            size: 11,
          },
          bordercolor: '#c7c7c7',
          align: 'left',
          name: ['infoTrial', 'officialTitle'],
          // captureevents: true,
        },
        { // complete time
          x: durationPoint.x,
          y: durationPoint.y - 0.05,
          text: completeTime,
          showarrow: false,
          font: {
            size: 8,
          },
          name: 'completeTime',
        }
      ]
    },
    yRange: yRange,
  };
}
