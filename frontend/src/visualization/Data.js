// 추출될 정보를 담을 class들 - 해당 정보들로 모식도를 그린다.

/*피험자에 대한 정보를 담는다
  @param {string} condition        피험자의 condition
  @param {string} gender           피험자의 성별
  @param {string} healthyCondition 피험자가 건강한 상태인지
  @param {string} maxAge           최대 나이
  @param {string} minAge           최소 나이
  @param {string} enrollmentNum 모집하는 피험자의 수 */
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

/*임상시험 소개와 관련된 정보를 담는다
  @param {string} title         임상시험설계의 title
  @param {string} officialTitle 임상시험설계의 official title
  @param {string} objective     임상시험설계의 목적
  @param {string} completeTime  임상시험연구 완료 시간
  @param {string} NCTID         ClinicalTrials의 임상시험번호 */
class InfoTrial {
  constructor(officialTitle, title, objective, completeTime, NCTID) {
    this.officialTitle = officialTitle
    this.title = title
    this.objective = objective
    this.completeTime = completeTime
    this.NCTID = NCTID
  }
}

/* 중재군에 대한 정보를 담는다
  @param {string} ArmGroupType            중재군의 종류
  @param {string} ArmGroupLabel           중재군의 이름
  @param {string} InterventionDescription 중재군이 사용하는 intervention */
class ArmGroup {
  constructor(ArmGroupType, ArmGroupLabel, InterventionDescription) {
    this.armGroupType = ArmGroupType
    this.armGroupLabel = ArmGroupLabel
    this.interventionDescription = InterventionDescription
  }
}

/* Intervention에 대한 정보를 담는다
  @param {string} masking       가림 정도
  @param {string} allocation    allocation 방식
  @param {string} washoutPeriod 휴악 기간
  @param {string} enrollment    참여하는 피험자 수
  @param {string list} namelist 중재군이 사용하는 intervention 이름 모음
  @param {string list} typelist 각 중재군이 사용하는 intervention type
  @param {string} ratio         중재군별 인원 비율 */
class Intervention {
  constructor(masking, allocation, washoutPeriod, enrollment, namelist, typelist, ratio) {
    this.masking = masking
    this.allocation = allocation
    this.washoutPeriod = washoutPeriod
    this.enrollment = enrollment
    this.namelist = namelist
    this.typelist = typelist
    this.ratio = ratio
  }
}

// 위 4가지 정보를 포함
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