import axios from "axios";

const prod = `http://3.35.243.113:5000`;
const local = `http://localhost:5000`;

// 개발자의 편의성을 위함. local에서 작업중이라면 7번의 isprod를 false로 바꿀것.
let isprod = true;
let url;
if(isprod === true){
  url = prod;
}else{
  url = local;
}

export const getRequest = async (nctid) => {
  const response = await fetch(url+`/api/${nctid}`);
  const body = await response.json();
  return body;
};

//axios를 위한 함수
export const myRequest = async (nctid) => {
  // console.log(nctid);
  try {
    const retries = 2;
    let body = {
      url: nctid,
    };
    let req;
    for (let q = 0; q < retries; q++) {
      try {
        req = await axios.post(url+`/api`, body);
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
    return req.data;
  } catch (e) {
    console.log(e);
  }
};

export const postRequest = async (json) => {
  let response;
  try {
    response = await axios.post(url+'/create', json);
  }
  catch (error) {
    console.log(error);
  }

  return response.data;
}

export const loadRequest = async (nctid) => {

  let response;
  let body = { url: nctid };
  try {
    response = await axios.post(url+'/load', body);
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
    let body = {
      url: nctid,
    };
    let req;
    for (let q = 0; q < retries; q++) {
      try {
        req = await axios.post(url+`/crawling`, body);
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