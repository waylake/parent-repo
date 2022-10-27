import axios from "axios";

export const getRequest = async (nctid) => {
  const response = await fetch(`http://localhost:5000/api/${nctid}`);
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
        req = await axios.post(`http://localhost:5000/api`, body);
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
    console.log(req);
    return req.data;
  } catch (e) {
    console.log(e);
  }
};

export const postRequest = async (json) => {
  let response;
  try {
    response = await axios.post('http://localhost:5000/create', json);
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
    response = await axios.post('http://localhost:5000/load', body);
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
        req = await axios.post(`http://localhost:5000/crawling`, body);
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