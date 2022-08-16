// import fetch from 'node-fetch';
// 이걸로 export할 수 있나 확인중
export const getData = () => fetch("http://localhost:3000/NCT01967771/")
  .then(response => response.json())