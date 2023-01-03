import axios from "axios";

const prod = `http://3.35.243.113:5000`;
const local = `http://localhost:5000`;

// 개발자의 편의성을 위함. local에서 작업중이라면 7번의 isprod를 false로 바꿀것.
let isprod = false;
let url;
if (isprod) {
  url = prod;
} else {
  url = local;
}

// 편집된 모식도 불러오기 
export const getRequest = async (info) => {

  const { api, id } = info;

  let response;
  try {
    response = await axios.get(`${url}/api/${api}/${id}`);
  }
  catch (error) {
    console.log(error);
  }

  return response.data;
}

export const writeImgRequest = async (imgSrc, nctID) => {
  let response;
  try {
    response = await axios.post(url + '/img', {
      imgSrc,
      nctID
    });
  }
  catch (error) {
    console.log(error);
  }

  return response.data;
};

export const readImgRequest = async () => {
  let response;
  try {
    response = await axios.get(url + '/img');
  }
  catch (error) {
    console.log(error);
  }

  return response.data;
}

export const postRequest = async (json) => {
  let response;
  try {
    response = await axios.post(url + '/create', json);
  }
  catch (error) {
    console.log(error);
  }

  return response.data;
}

export const loadRequest = async (nctid) => {

  let response;
  try {
    response = await axios.get(`${url}/load/${nctid}`);
  }
  catch (error) {
    console.log(error);
  }

  return response.data;
}

export const myCrawling = async (nctid) => {
  // console.log(nctid);
  try {
    const retries = 2;
    let req;
    for (let q = 0; q < retries; q++) {
      try {
        req = await axios.get(url + `/crawling/${nctid}`);
        if (req) {
          break;
        } else {
          console.log(req);
          console.log("cannot fetch data");
        }
      } catch (e) {
        console.log("cannot fetch error");
      }
    }
    // console.log("this is from crawling! \n", req.data);
    return req.data;
  } catch (e) {
    console.log(e);
  }
};