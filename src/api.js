import axios from "axios";

export const getRequest = async (nctid) => {
  const response = await fetch(`http://localhost:5000/api/${nctid}`);
  const body = await response.json();
  return body;
};

export const putRequest = async (nctid, json) => {
  const response = await fetch(`http://localhost:5000/api/${nctid}`, {
    method: 'PUT',
    body: json,
  });
  const body = await response.json();
  return body;
}

export const postRequest = async (nctid, json) => {
  const response = await fetch(`http://localhost:5000/api`, {
    method: 'POST',
    body: json,
  });
  const body = await response.json();
  return body;
}


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
    return req.data;
  } catch (e) {
    console.log(e);
  }
};
