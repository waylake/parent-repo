import { Point } from "./Point";
import { drawPopulation } from "./drawPopulation";
import { drawPreIntervention } from "./drawPreIntervention";

import { drawBranch } from "./drawBranch";
import { drawInfoTrial } from "./drawInfoTrial";

export function visualization(data) {
  // data from extraction
  let designModel = data.designModel;
  let population = data.population;
  let infoTrial = data.infoTrial;
  let armGroup = data.armGroup;
  let intervention = data.intervention;
  // gather altogether
  let Gdata = [];
  let Glayout = {
    shapes: [],
  };
  let Gframes = [];
  let Gconfig = {};

  let startPoint = new Point(10, 10);
  let startW = 4;
  let box1 = {
    boxstyle: "round",
    ec: (1.0, 0.5, 0.5), // ec: edgeColor, fc: faceColor
    fc: (1.0, 0.8, 0.8),
  };
  const popDrawInfo = drawPopulation(startPoint, startW, box1, population);
  const startH = popDrawInfo.startH
  const numberPoint = new Point(startPoint.x + startW, startPoint.y + startH / 2);
  const numberW = 2;
  // # allocation
  const radius = 0.6;
  const allocationPoint = new Point(numberPoint.x + numberW + radius, numberPoint.y);
  const preInterDrawInfo = drawPreIntervention(numberPoint, numberW, allocationPoint, radius, intervention);

  // 합치기 수정 필요
  Glayout.shapes = Glayout.shapes.concat(popDrawInfo.layout.shapes, preInterDrawInfo.layout.shapes);
  Gdata.push(preInterDrawInfo.data);




  let armGLinePoint1 = new Point(allocationPoint.x + radius, allocationPoint.y);
  let armGW = 1;
  let armGArrowW = 7;
  let legendPoint = new Point(startPoint.x, startPoint.y - startH / 6);

  let branchDrawInfo = drawBranch(
    armGLinePoint1,
    armGW,
    armGArrowW,
    startPoint,
    startH,
    legendPoint,
    intervention,
    designModel,
    armGroup
  );

  let durationPoint = new Point(armGLinePoint1.x + armGW + armGArrowW + 1, allocationPoint.y - startH * 2 / 3);
  let numArm = armGroup.armGroupLabel.length;
  let detailDrawInfo = drawInfoTrial(durationPoint, startPoint, startH, legendPoint, numArm, infoTrial);

  //push info into G Lists
  for (let i = 0; i < popDrawInfo.data.length; i++) {
    Gdata.push(popDrawInfo.data[i])
  }
  for (let i = 0; i < branchDrawInfo.branch.lineList.length; i++) {
    Gdata.push(branchDrawInfo.branch.lineList[i]);
  }
  Gdata.push(detailDrawInfo.completeline);

  // gather altogether
  return {
    Gdata,
    Glayout,
    Gframes,
    Gconfig,
  };

  // writeIntervention(ax, startPoint, startH, armGLinePoint1, armGW, armGArrowW, designModel, armGroup, intervention);

  // let durationPoint = new Point(armGLinePoint1.x+armGW+armGArrowW+1, allocationPoint.y-startH);
  // let numArm = armGroup.armGroupLabel.length;

  // ax 설정하는 부분은 아직 안 적음.
}
