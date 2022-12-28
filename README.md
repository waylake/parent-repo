# Frontend  ![Generic badge](https://img.shields.io/badge/React-18.2.0-green.svg) ![Generic badge](https://img.shields.io/badge/Plotly.js-2.13.1-blue.svg)
임상시험으로부터 핵심적인 정보를 추출하고, 추출된 정보를 시각화하여 모식도를 생성하는 Web
<br>
<br>

![image](https://user-images.githubusercontent.com/107476261/209201950-28a76f69-c7f2-4be8-8d3d-03b568865bb7.png)

## 설치 및 실행
1. git clone
```
$ git clone https://github.com/2022MediAISH/frontend
```
2. dependency 설치
```
$ npm install
```
3. 실행
```
$ npm run start
```

## 사용 방법
- **모식도 생성**
  - clinical trial에 있는 임상시험의 url 또는 NCTID를 검색창에 입력
  - example button 클릭(각 design model별로 세개씩)
  - history image 클릭
- **모식도 편집**

  - <img src="https://user-images.githubusercontent.com/107476261/209205623-e1c183ef-3395-4f76-be1c-68d56ae6de8d.png" width=3% > 버튼 클릭하면 편집 모드로 전환
  - 텍스트 편집 항상 가능, branch가 3개 이상의 cross-over 모델인 경우 branch 편집 가능


## 파일 설명
- ### src
  + **App.js:** 컴포넌트를 렌더링하는 파일
  + **api.js:** 서버와 통신하는 함수를 모아둔 파일
  <br>
- ### Visualization
  + **Data.js:** 임상 시험의 모듈 단위로 클래스 정의
  + **DataExtraction.js:** json 형식의 임상 시험에 대한 정보를 Data.js에서 정의한 클래스로 분류
  + **drawBranch.js:** design model(single, parallel, cross-over)에 따라 branch 생성 함수 정의
  + **drawInfoTrial.js:** title, objective, official title 생성 함수 정의
  + **drawPopulation.js:** condition, gender, healty condition, max age, min age 생성 함수 정의
  + **drawPreIntervention.js:** masking, enrollment, allocation, ratio 생성 함수 정의
  + **edit.js:** 모식도 편집 기능을 구현하는데 필요한 함수들을 모아둔 파일
  + **highlight.js:** 모식도 내에 있는 정보 클릭시 왼편에 있는 원문이 모식도가 가리키는 정보가 있는 페이지로 이동하며 하이라이트되는 기능 정의
  + **visualization.js:** 모식도를 구현하는 함수들을 직접 사용하는 파일
  + **writeIntervention.js:** 약물명, 복용량, 복용 방법 생성 함수 정의
  <br>
- ### Components
  + **Button.js:** 모식도 편집, 편집 취소, 저장 등 모식도의 오른쪽 상단에 있는 버튼
  + **Example.js:** design model별 예시 버튼
  + **History.js:** 모식도 방문 기록 이미지
  + **Loading.js:** 로딩 이미지
  + **History.js:** 모식도 방문 기록 이미지
  + **OriginalText.js:** 원문
  + **Search.js:** 검색 바


