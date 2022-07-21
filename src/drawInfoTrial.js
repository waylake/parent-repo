export function drawInfoTrial(
  durationPoint,
  startPoint,
  startH,
  legendPoint,
  numArm,
  infoTrial
) {
  // // #objective
  // let objPoint = Point(startPoint.x, startPoint.y+startH +0.7)
  // bboxString(ax, objPoint.x, objPoint.y, "Objective: " + infoTrial.objective, 130, 15, 1)
  // objective_line = bboxStringLine("Objective: " + infoTrial.objective, 140) // # objective 줄 개수

  // // # infoTrial.title
  // titlePoint = Point(objPoint.x, objPoint.y+objective_line/10+0.1)
  // bboxString(ax, titlePoint.x, titlePoint.y, "Title: "+ infoTrial.title, 100, 20, 1)

  // #complete_time
  let completeline = {
    x: [durationPoint.x, durationPoint.x],
    y: [durationPoint.y, durationPoint.y + startH*4/3],
    mode: "lines",
    line: {
      color: "rgba(1,1,1,1)",
      width: 1,
    },
  };

  // // # infoTrial.official title
  // officialPoint = Point(startPoint.x, startPoint.y-startH/2)
  // bboxString(ax, officialPoint.x, legendPoint.y - (numArm+1)*startH/3, "Official Title: " +  info_trial.official_title, 110, 15, 1)

  return {
    completeline,
  };
}
