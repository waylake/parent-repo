import json
from pymongo import MongoClient
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

secret_file = os.path.join(BASE_DIR, 'secrets.json') # secrets.json 파일 위치를 명시

with open(secret_file) as f:
    secrets = json.loads(f.read())

def get_secret(setting, secrets=secrets):
    """비밀 변수를 가져오거나 명시적 예외를 반환한다."""
    try:
        return secrets[setting]
    except KeyError:
        error_msg = "Set the {} environment variable".format(setting)
        raise ImproperlyConfigured(error_msg)

# Making Connection
mongoKey = get_secret("mongoURI")
myclient = MongoClient(mongoKey)

# database
db = myclient["testdb"]

# Created or Switched to collection
# names: GeeksForGeeks
Collection = db["ACM+Biolink"] # ACM or ACM+Biolink

# run python

# upload the json file
def upload():
     # data_extraction_biolinkbert로 추출된 json파일 업로드
     for filename in os.listdir("./NCT_ID_database_biolink_1"): # json file folder directory
          with open(os.path.join("./NCT_ID_database_biolink_1", filename), 'r') as file:
               file_data = json.load(file)
               print(filename)
               file_name = filename[0:11]
               # make a query to check whether the file is in DB
               query = {"_id":file_name}
               # If the file of the query is in DB
               if(Collection.count_documents(query)==1):
                    # delete
                    Collection.find_one_and_delete(query)
               # Inserting the loaded data in the Collection
               # if JSON contains data more than one entry
               # insert_many is used else insert_one is used
               if isinstance(file_data, list):
                    Collection.insert_many(file_data)
               else:
	               Collection.insert_one(file_data)


upload();
