class Population {
  constructor(condition, gender, healthyCondition, maxAge, minAge, enrollmentNum) {
    this.condition = condition
    this.gender = gender
    this.healthyCondition = healthyCondition
    this.maxAge = maxAge
    this.minAge = minAge
    this.enrollmentNum = enrollmentNum
  }
}

class InfoTrial {
  constructor(officialTitle, title, objective, completeTime, NCTID) {
    this.officialTitle = officialTitle
    this.title = title
    this.objective = objective
    this.completeTime = completeTime
    this.NCTID = NCTID
  }
}

class ArmGroup {
  constructor(ArmGroupType, ArmGroupLabel, InterventionDescription) {
    this.armGroupType = ArmGroupType
    this.armGroupLabel = ArmGroupLabel
    this.interventionDescription = InterventionDescription
  }
}

class Intervention {
  constructor(masking, allocation, washoutPeriod, enrollment, namelist, ratio) {
    this.masking = masking
    this.allocation = allocation
    this.washoutPeriod = washoutPeriod
    this.enrollment = enrollment
    this.namelist = namelist
    this.ratio = ratio
  }
}

class Information {
  constructor(designModel, population, infoTrial, armGroup, intervention) {
    this.designModel = designModel
    this.population = population
    this.infoTrial = infoTrial
    this.armGroup = armGroup
    this.intervention = intervention
  }
}

export { Population, InfoTrial, ArmGroup, Intervention, Information }