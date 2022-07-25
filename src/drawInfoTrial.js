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
  const [objectiveLine, objective] = countLine("Objective: " + infoTrial.objective, 70);
  const title = countLine("Title: " + infoTrial.title, 70)[1];
  const official_title = countLine("Official Title: " + infoTrial.official_title, 70)[1];
  // #objective
  const objPoint = new Point(startPoint.x, startPoint.y + startH + 0.3)

  // bboxString(ax, objPoint.x, objPoint.y, "Objective: " + infoTrial.objective, 130, 15, 1)



  // // # infoTrial.title
  const titlePoint = new Point(objPoint.x, objPoint.y + objectiveLine / 10 + 0.1);
  // bboxString(ax, titlePoint.x, titlePoint.y, "Title: "+ infoTrial.title, 100, 20, 1)

  // #complete_time


  // // # infoTrial.official title
  const officialPoint = new Point(startPoint.x, startPoint.y - startH / 2);
  // bboxString(ax, officialPoint.x, legendPoint.y - (numArm+1)*startH/3, "Official Title: " +  info_trial.official_title, 110, 15, 1)



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
      },
    ],
    layout: {
      annotations: [
        {
          x: objPoint.x,
          y: objPoint.y,
          text: objective,
          showarrow: false,
          xanchor: 'left',
        },
        {
          x: titlePoint.x,
          y: titlePoint.y,
          text: title,
          showarrow: false,
          xanchor: 'left',
        },
        {
          x: officialPoint.x,
          y: legendPoint.y - (numArm + 1) * startH / 3,
          text: official_title,
          showarrow: false,
          xanchor: 'left',
        },
      ]
    }
  };
}
