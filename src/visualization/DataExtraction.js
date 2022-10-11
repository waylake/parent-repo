import * as data from "./Data";
// import {getData} from './getJson.js';

export function getInfo(infoDict) {
  // console.log("this is from get info ", infoDict);

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
    console.log(info_list[i]["InterventionDescription"]);
    if (info_list[i]["InterventionDescription"].length === 0) { // if ["InterventionDescription"] is empty fill only key obj
      console.log("if");
      InterventionDescription.push(
        [{
          "Dosage": "",
          "DrugName": "",
          "Duration": "",
          "HowToTake": "",
          "OtherName": []
        }]
      )
    }
    else {
      InterventionDescription.push(info_list[i]["InterventionDescription"]);
    }
  }

  const armGroup = new data.ArmGroup(
    ArmGroupType,
    ArmGroupLabel,
    InterventionDescription
  );

  // ##intervetntion##
  const masking = infoDict["Masking"].includes("None")
    ? "None"
    : infoDict["Masking"]; // None이면 그냥 None만 리턴
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
