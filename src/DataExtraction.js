import * as data from "./Data";

export function getInfo(url) {
  // codes to run python file in javascript

  const infoDict = require("./NCT03507790.json"); // read json file by using require method
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
  const official_title = infoDict["OfficialTitle"];
  const objective = infoDict["Objective"];
  const complete_time = infoDict["CompleteTime"];
  const title = infoDict["Title"];
  const NCTID = infoDict["NCTID"];

  const infoTrial = new data.InfoTrial(
    official_title,
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
