// import { countLine } from "./drawPopulation";
// import { Point } from "./Point";

import { faHighlighter } from "@fortawesome/free-solid-svg-icons";
import { highlight } from "./highlight.js";
import { countLine } from "./drawPopulation";

// 단어 break해서라도 네모박스 라인 맞추기 위한 함수
export function lineBreak(inString, limit) {
  let point = 0;
  let brString = [];
  let n = 1;
  while (inString.length > limit) {
    n++;
    point = inString.slice(0, limit).lastIndexOf("");
    if (point === -1) {
      brString += inString.slice(0, limit) + "<br>";
      inString = inString.slice(limit);
    } else {
      brString += inString.slice(0, point) + "<br>";
      inString = inString.slice(point + 1);
    }
  }
  // console.log("dif: "+(limit - inString.length));
  // inString = inString + (" ").repeat((limit - inString.length)*1.6);
  brString += inString;
  return [n, brString];
}

export function drawInfoTrial(
  durationPoint,
  startPoint,
  startH,
  legendPoint,
  objPoint,
  titlePoint,
  officialPoint,
  numArm,
  infoTrial
) {
  const [titleLine, title] = countLine("<b>Title:</b> " + infoTrial.title, 70);
  const [objectiveLine, objective] = countLine(
    "Objective: " + infoTrial.objective,
    82
  );
  const [officialTitleLine, officialTitle] = lineBreak(
    "Official Title: " + infoTrial.officialTitle,
    98
  );
  // const [officialTitleLine, officialTitle] = countLine("Official Title: " + infoTrial.officialTitle, 78);
  const completeTime =
    infoTrial.completeTime + " months<br>required to complete";

  const yRange = [
    officialPoint.y - officialTitleLine / 10,
    titlePoint.y + titleLine / 10,
  ];
  return {
    data: [
      {
        x: [durationPoint.x, durationPoint.x],
        y: [durationPoint.y, durationPoint.y + (startH * 4) / 3],
        mode: "lines",
        line: {
          color: "rgba(1,1,1,1)",
          width: 1,
        },
        showlegend: false,
        hoverinfo: "skip", // branch 라인 위에 마우스 올렸을 때 데이터 보이지 않도록 설정
      },
    ],
    layout: {
      annotations: [
        {
          //objective
          x: objPoint.x,
          y: objPoint.y,
          text:
            "<a href='#studydesc' target='_self' style='color:black;'>" +
            objective +
            "</a>",
          showarrow: false,
          xanchor: "left",
          yanchor: "bottom",
          font: {
            size: 13,
          },
          bordercolor: "#c7c7c7",
          align: "left",
          name: ["infoTrial", "objective"],
          bgcolor: "rgba(253, 235, 200, 0.5)",
          // captureevents: true,
        },
        {
          //title
          x: titlePoint.x,
          y: titlePoint.y,
          text:
            "<a href='#wrapper' target='_self' style='color:black;'>" +
            title +
            "</a>",
          showarrow: false,
          xanchor: "left",
          yanchor: "bottom",
          font: {
            size: 16,
          },
          // bordercolor: '#c7c7c7',
          align: "left",
          name: ["infoTrial", "title"],
          // captureevents: true,
        },
        {
          // official title
          x: officialPoint.x,
          y: legendPoint.y - startH / 3,
          text:
            "<a href='#studydesign' target='_self' style='color:black;'>" +
            officialTitle +
            "</a>",
          showarrow: false,
          xanchor: "left",
          yanchor: "top",
          font: {
            size: 13,
          },
          bordercolor: "#c7c7c7",
          align: "left",
          name: ["infoTrial", "officialTitle"],
          bgcolor: "rgba(253, 235, 200, 0.5)",
          // captureevents: true,
        },
        {
          // complete time
          x: durationPoint.x,
          y: durationPoint.y - 0.05,
          text:
            "<a href='#studydesign' target='_self' style='color:black;'>" +
            completeTime +
            "</a>",
          showarrow: false,
          font: {
            size: 8,
          },
          name: ["infoTrial", "completeTime"],
        },
      ],
    },
    yRange: yRange,
  };
}
