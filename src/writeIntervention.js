// export function writeIntervention( startPoint, startH, armGLinePoint1, armGW, armGArrowW, designModel, armG, intervention){
//   if ((designModel === "Single Group Assignment" && numBranch === 1) || numBranch===1){
//     // # numBranch 추가한 이유: single 이지만 군이 여러개인 경우 때문.
//       let drugInfo = armG.interventionDescription[0]
//       let drugdescription = ""
//       for (let i=0; i<drugInfo.length; i++){
//         drugdescription += drugInfo[i]["DrugName"] +"(" + drugInfo[i]["Dosage"] + ") "
//         textStartX = armGLinePoint1.x+armGW + 0.1
//         testStartY = startPoint.y+startH/2
//         stringGoUp(ax, drugdescription, 90, textStartX, testStartY, 13, deltaOfLetter)
//         ax.text(textStartX+armGArrowW-0.3 , testStartY-0.2, drugInfo[0]["Duration"], fontdict=fontArm)

//       }
//   }
// }