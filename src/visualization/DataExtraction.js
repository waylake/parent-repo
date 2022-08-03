import * as data from "./Data";
// import {request_call} from "../resource_control.py";
// import $ from "jquery";
// import {PythonShell} from 'python-shell';

export function getInfo(url) {
  // codes to run python file in javascript
  // const pyodide = window.pyodide;
  // pyodide.runPython(request_call(url));
  // const infoDict = pyodide.runPython(request_call(url));
  // console.log(infoDict);
 ////////////////////////////////////////////////////
  // var options = {
  //   mode: 'text',
  //   args: ['https://www.clinicaltrials.gov/ct2/show/NCT04050098?term=mg&draw=3&rank=51', 'My Second Argument', '--option=123']
  // };

  // PythonShell.run('../test.py', options, function (err, results) {
  //     if (err) throw err;
  //     // results is an array consisting of messages collected during execution
  //     console.log('results: %j', results);
  // });

  // const {spawn} = require('child_process');
  // const newjson = spawn('/home/jun/anaconda3/bin/python', 
  // ['../resource_control.py', "https://www.clinicaltrials.gov/ct2/show/NCT04050098"]);
  const infoDict = require("../NCT_ID_database/NCT04844424.json"); // read json file by using require method
  // ##designmodel##
  const designModel = infoDict["DesignModel"];

  // ##population##
  const condition = infoDict["PopulationBox"]["Condition"];
  const gender = infoDict["PopulationBox"]["Gender"];
  const healthy_condition = infoDict["PopulationBox"]["HealthyCondition"];
  const maxAge = infoDict["PopulationBox"]["MaxAge"];
  const minAge = infoDict["PopulationBox"]["MinAge"];
  const enrollmentNum = infoDict["PopulationBox"]["Participant"];

  const population = new data.Population(
    condition,
    gender,
    healthy_condition,
    maxAge,
    minAge,
    enrollmentNum
  );

  // ##info_trial##
  const officialTitle = infoDict["OfficialTitle"];
  const objective = infoDict["Objective"];
  const complete_time = infoDict["CompleteTime"];
  const title = infoDict["Title"];
  const NCTID = infoDict["NCTID"];

  const infoTrial = new data.InfoTrial(
    officialTitle,
    title,
    objective,
    complete_time,
    NCTID
  );

  // ##Armgroup##
  const ArmGroupType = [];
  const ArmGroupLabel = [];
  const InterventionDescription = [];
  const info_list = infoDict["DrugInformation"]["ArmGroupList"];
  // for i in info_list:
  for (var i = 0; i < info_list.length; i++) {
    ArmGroupType.push(info_list[i]["ArmGroupType"]);
    ArmGroupLabel.push(info_list[i]["ArmGroupLabel"]);
    InterventionDescription.push(info_list[i]["InterventionDescription"]);
  }

  const armGroup = new data.ArmGroup(
    ArmGroupType,
    ArmGroupLabel,
    InterventionDescription
  );

  // ##intervetntion##
  const masking = infoDict["Masking"].includes('None') ? 'None' : infoDict["Masking"]; // None이면 그냥 None만 리턴
  const allocation = infoDict["Allocation"];
  const ratio = infoDict["PopulationRatio"];
  // # print(infoDict)
  const washout_period = infoDict["WashoutPeriod"];
  const enrollment = infoDict["Enrollment"];
  const namelist = infoDict["InterventionName"].split(",");
  const intervention = new data.Intervention(
    masking,
    allocation,
    washout_period,
    enrollment,
    namelist,
    ratio
  );

  return new data.Information(
    designModel,
    population,
    infoTrial,
    armGroup,
    intervention
  );
}

export default getInfo;
