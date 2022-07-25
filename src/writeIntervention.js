export function writeIntervention(
  startPoint,
  startH,
  armGLinePoint1,
  armGW,
  armGArrowW,
  designModel,
  armG,
  intervention
) {
  if (
    (designModel === "Single Group Assignment" && numBranch === 1) ||
    numBranch === 1
  ) {
    // # numBranch 추가한 이유: single 이지만 군이 여러개인 경우 때문.
    let drugInfo = armG.interventionDescription[0];
    let drugdescription = "";
    for (let i = 0; i < drugInfo.length; i++) {
      drugdescription +=
        drugInfo[i]["DrugName"] + "(" + drugInfo[i]["Dosage"] + ") ";
      textStartX = armGLinePoint1.x + armGW + 0.1;
      testStartY = startPoint.y + startH / 2;
    }
  }

  return {
    layout: {
      annotations: [
        {
          x: armGLinePoint1.x + armGW + 0.1,
          y: startPoint.y + startH / 2,
          xanchor: "left",
          yanchor: "top",
          align: "right",
          text: drugdescription,
          showarrow: false,
        },
        {
          x: textStartX + armGArrowW - 0.3,
          y: testStartY - 0.2,
          xanchor: "left",
          yanchor: "top",
          align: "right",
          text: drugInfo[0]["Duration"],
          showarrow: false,
        },
      ],
    },
  };
}
