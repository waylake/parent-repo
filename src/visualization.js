import { Point } from "./Point";
import { drawPopulation } from "./drawPopulation";
import { drawPreIntervention } from "./drawPreIntervention";


export function visualization(data){
  let designModel = data.designModel;
  let population = data.population;
  let infoTrial = data.infoTrial;
  let armGroup = data.armGroup;
  let intervention = data.intervention;
  let Gdata = [];
  let Glayout = {
    shapes: [],
  };
  let Gframes = [];
  let Gconfig = {};


  let startPoint = new Point(10, 10);
  let startW = 4;
  let box1 = {'boxstyle': 'round', 
          'ec': (1.0, 0.5, 0.5), // ec: edgeColor, fc: faceColor
          'fc': (1.0, 0.8, 0.8)}
  let popDrawInfo = drawPopulation(startPoint, startW, box1, population);
  const startH = popDrawInfo.startH
  let numberPoint = new Point(startPoint.x+startW, startPoint.y+startH/2);
  let numberW = 2;
  // # allocation
  let radius = 0.2;
  let allocationPoint = new Point(numberPoint.x+numberW+radius, numberPoint.ygit);
  let preInterDrawInfo = drawPreIntervention(numberPoint, numberW, allocationPoint, radius, intervention);

  // 합치기
  Glayout.shapes = Glayout.shapes.concat(popDrawInfo.layout.shapes, preInterDrawInfo.layout.shapes);
  Gdata.push(preInterDrawInfo.data);
  
  return {
    Gdata,
    Glayout,
    Gframes,
    Gconfig,
  };
  


  // let armGLinePoint1 = new Point(allocationPoint.x + radius, allocationPoint.y);
  // let armGW = 1;
  // let armGArrowW = 7;
  // let legendPoint = new Point(startPoint.x,startPoint.y-startH/6);

  // drawBranch(ax, armGLinePoint1, armGW, armGArrowW, startPoint, startH, legendPoint, intervention, designModel, armGroup);
  // writeIntervention(ax, startPoint, startH, armGLinePoint1, armGW, armGArrowW, designModel, armGroup, intervention);

  // let durationPoint = new Point(armGLinePoint1.x+armGW+armGArrowW+1, allocationPoint.y-startH);
  // let numArm = armGroup.armGroupLabel.length;

  // ax 설정하는 부분은 아직 안 적음.
}