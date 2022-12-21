## 2022 산학협력 프로젝트 메디아이플러스
#  임상시험 설계 모식도 자동생성 및 시각화
**메디아이플러스**사와 함께 9개월간 진행한 프로젝트입니다. 
현재 임상시험 모식도는 임상설계사들이 임상시험 정보를 일일이 확인하며 수동으로 그리고 있습니다. 이로인해 하나의 모식도를 제작하는데에 많은 **시간과 비용**이 들어갑니다. 따라서 저희는 모식도 제작 시간 단축 및 직관적 이해도를 증가시킬 수 있는 **모식도 시각화 자동화 기술**을 개발하였습니다.

# Repository 설명

### **frontend**
- 임상시험 설계 모식도 자동생성 및 시각화를 위한 frontend 코드 (React 사용)
### **backend**
- 임상시험 설계 모식도 자동생성 및 시각화를 위한 backend 코드 (node.js 사용) 

# 개발과정
## 4 ~ 5월: 선행 학습

- 임상시험 트렌드 분석 및 서비스 조사
  - BrakenData (ClinicalTrials.gov 데이터 대시보드)
- 도메인 지식 학습
  - 임상시험 관련 용어 학습
  - 임상시험 교육 (메디아이플러스 데이터팀 연구원 채홍조님 교육)
- ClinicalTrials.gov 데이터 추출 및 시각화
    - 웹 크롤링
    - API 활용
    
  
 
## 6 ~ 8월: 하계 집중학습
- ClinicalTrials.gov API 데이터 분석
	- 정보추출 자동화 가능 및 불가능 요소 파악
	- 가능요소: ClinicalTrials API
	- 불가능요소: ClinicalTrials API + 개체명 인식 API ( + 의미역 인식 API)
	- 자연어 처리 알고리즘 개발
	   - BiolinkBert, BioBert, ACM 성능 평가
	    - 평가지표: 약물명의 추출 정확도 (Recall)
- MoSeek 서비스 웹사이트 제작
- DB 구축 (MongoDB)

## 9 ~ 12월: 서비스 최적화
- 생의학 자연어 처리 모델 선정
	- BiolinkBert, BioElectra, ClinicalBert 성능 평가
	- 평가지표: 약물명의 추출 정확도 (Recall), 학습 속도, 모델 크기
	- 모든 성능평가 지표를 종합해봤을때 BiolinkBert가 선정됨.
- 모식도 편집 기능 및 검색 기능 추가
	- 모식도 그래프와 텍스트 수정 가능
   - 검색 시 모식도 원문 하이라이트

	

# 성능평가

약물명 개체명 인식기 성능평가: ACM vs  BioLinkBERT  vs  BioElectra  vs  ClinicalBERT
Test Dataset: 약물명 데이터 4,520개
(ClinicalTrial.gov의  Drug  Intervention 3,964개 + 식품의약품 안전처 제공 약물명 556개)

<img src="https://user-images.githubusercontent.com/78090753/208905779-9ac9bc69-d229-4764-80d4-48faba1c099b.png" width="60%" height="60%">

**성능평가 결과**: **BiolinkBert + ACM** 선정

# MoSeek: 모식도 자동생성 및 시각화 서비스

<img src="https://user-images.githubusercontent.com/78090753/208905656-48368b3d-de89-41c2-9e8c-8b1d09591b11.png" width="60%" height="60%">

## 기능
1. NCT_ID 및 ClinicalTrials.gov URL 로 검색해 해당 임상시험 설계 정보를 모식도로 한 눈에 파악할 수 있음.
2. 모식도를 쉽게 수정 및 저장할 수 있음.
3. 모식도 내용을 클릭 한 번으로 원문에서 찾아볼 수 있음. (검색 기능) 
