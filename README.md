# update_DB

> 임상시험 원문을 통해 모식도를 그리기 위한 정보추출 파일(json)을 저장하기 위한 데이터베이스입니다. 
> json 형식으로 정보를 저장하기 때문에 몽고디비를 사용해 주었습니다.


#### **upload.py**  
input: json(정보추출 파일)  output: DB에 삽입  
최근 5개년 임상시험에 대해 추출된 json파일을 DB에 업로드하기 위한 파일입니다.

#### **new_clinicalTrial_acm.py**  
ClinicalTrials.gov 사이트에 새롭게 등재된 임상시험에 대해 정보추출 코드를 돌리고 데이터베이스에 업로드하기 위한 파일입니다.  
정보추출 파일: data_extract_acm.py
```
DB 중복 확인 -> 임상시험 사이트 내 업데이트 날짜 비교 -> 삭제 -> 정보추출 재진행 -> DB에 삽입
```
#### **new_clinicalTrial_biolink.py**  
ClinicalTrials.gov 사이트에 새롭게 등재된 임상시험에 대해 정보추출 코드를 돌리고 데이터베이스에 업로드하기 위한 파일입니다.  
정보추출 파일: data_extract_Biolinkbert.py
```
DB 중복 확인 -> 임상시험 사이트 내 업데이트 날짜 비교 -> 삭제 -> 정보추출 재진행 -> DB에 삽입
```
