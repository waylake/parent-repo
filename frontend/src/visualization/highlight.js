// get index of query array including target string
function getIndex(queryArr, targetStr) {
  let arr = [];
  for (let q = 0; q < queryArr.length; q++) {
    let str = queryArr[q].innerText;
    if (str.includes(targetStr)) {
      arr.push(q + 1);
    }
  }
  return arr;
}

function getOtherElemes(index, designModel, len_annos, len_interven) {
  let idxArr;
  let isArr = false;
  let interElemArr = [];

  let intervenStartIndex;
  let intervenEndIndex;
  if (designModel === "Crossover Assignment") {
    // 군 개수가 2개로 지정되어있기 때문에 숫자로 하드코딩해도 됨.
    intervenStartIndex = len_annos - 6;
    intervenEndIndex = len_annos - 4;
  }
  //// parallel, sequential, Single Group Assignment and others
  else {
    intervenStartIndex = len_annos - len_interven * 2;
    intervenEndIndex = len_annos;
  }

  let elem;
  // e.index: 1~13 은 공통임.
  // condition
  if (index === 1) {
    elem = document.querySelector(
      "#tab-body > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1)"
    );
  }
  // gender, healthy volunteer
  else if (index >= 2 && index <= 3) {
    let tags = document.querySelector(
      "#tab-body > div > div:nth-child(9) > div:nth-child(6) > table > tbody"
    );
    let order = index;
    elem = tags.querySelector("tr:nth-child(" + String(order) + ")");
  }
  // min & max age
  else if (index >= 4 && index <= 5) {
    elem = document.querySelector(
      "#tab-body > div > div:nth-child(9) > div:nth-child(6) > table > tbody > tr:nth-child(1)"
    );
  }
  // masking, enrollment, allocation, officialTitle, duration
  else if ((index >= 6 && index <= 8) || index === 12 || index === 13) {
    isArr = true; // not to implement style change in bottom of file.
    let studydesigns = document.querySelectorAll(
      "#tab-body > div > div:nth-child(1) > table > tbody > tr"
    );
    if (index === 6) idxArr = getIndex(studydesigns, "Masking");
    else if (index === 7) idxArr = getIndex(studydesigns, "Enrollment");
    else if (index === 8) idxArr = getIndex(studydesigns, "Allocation");
    else if (index === 12) idxArr = getIndex(studydesigns, "Title");
    else if (index === 13) idxArr = getIndex(studydesigns, "Date");

    idxArr.forEach((index) => {
      elem = document.querySelector(
        "#tab-body > div > div:nth-child(1) > table > tbody > tr:nth-child(" +
        index +
        ")"
      );
      interElemArr.push(elem);
    });
  }
  // ratio
  else if (index === 9) {
    // n=x인 부분만 쳐야됨
  }
  // objective
  else if (index === 10) {
    // elem = document.querySelector("");
    // title과 brief summary에서 가져옴.
  }
  // title
  else if (index === 11) {
    elem = document.querySelector("#main-content > div.tr-indent2 > h1");
  }

  //// 공통이 아닌 부분!!
  // 각 군별 intervention과 washout period 처리
  else if (index >= intervenStartIndex && index < intervenEndIndex) {
    let tags = document.querySelector(
      "#tab-body > div > div:nth-child(3) > table"
    ); // intervention query
    let nthIntervenIndex = index - intervenStartIndex;
    let order = index - intervenStartIndex;
    if (designModel != "Crossover Assignment")
      order = Math.floor(nthIntervenIndex / 2); // 기간까지 표시하기 위함
    elem = tags.querySelector(
      "tbody > tr:nth-child(" + String(order + 1) + ")"
    );
    // console.log("intervention ", index)
  }

  // crossover의 washout
  else if (index >= intervenEndIndex) {
    // 필요하다면 단어만 하이라이트도 필요. 일단은 표 전체를 하이라이트!
    elem = document.querySelector(
      "#tab-body > div > div:nth-child(3) > table > tbody"
    );
  }

  let result = [elem, interElemArr, isArr];
  // console.log("Get other elems ", result);
  return result;
}

export function highlight(e, infos, istwo) {
  // initialize
  let annotations = document.getElementsByClassName("annotation");
  let len_annos = annotations.length;
  if(istwo){
    len_annos = annotations.length/2;
  }
  // console.log(annotations);
  // console.log("e.index ", e.index);

  let isArr = false;

  let idxArr;
  let interElemArr = [];

  let designModel = infos.DesignModel;
  let len_interven = infos.DrugInformation.ArmGroupList.length;

  let intervenStartIndex;
  let intervenEndIndex;
  if (designModel === "Crossover Assignment") {
    // 군 개수가 2개로 지정되어있기 때문에 숫자로 하드코딩해도 됨.
    intervenStartIndex = len_annos - 6;
    intervenEndIndex = len_annos - 4;
  }
  //// parallel, sequential, Single Group Assignment and others
  else {
    intervenStartIndex = len_annos - len_interven * 2;
    intervenEndIndex = len_annos;
  }

  let elem;
  // e.index: 1~13 은 공통임.
  // condition
  let element_index = e.index%len_annos;
  if (element_index === 1) {
    elem = document.querySelector(
      "#tab-body > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1)"
    );
  }
  // gender, healthy volunteer
  else if (element_index >= 2 && element_index <= 3) {
    let tags = document.querySelector(
      "#tab-body > div > div:nth-child(9) > div:nth-child(6) > table > tbody"
    );
    let order = element_index;
    elem = tags.querySelector("tr:nth-child(" + String(order) + ")");
  }
  // min & max age
  else if (element_index >= 4 && element_index <= 5) {
    elem = document.querySelector(
      "#tab-body > div > div:nth-child(9) > div:nth-child(6) > table > tbody > tr:nth-child(1)"
    );
  }
  // masking, enrollment, allocation, officialTitle, duration
  else if ((element_index >= 6 && element_index <= 8) || element_index === 12 || element_index === 13) {
    isArr = true; // not to implement style change in bottom of file.
    let studydesigns = document.querySelectorAll(
      "#tab-body > div > div:nth-child(1) > table > tbody > tr"
    );
    if (element_index === 6) idxArr = getIndex(studydesigns, "Masking");
    else if (element_index === 7) idxArr = getIndex(studydesigns, "Enrollment");
    else if (element_index === 8) idxArr = getIndex(studydesigns, "Allocation");
    else if (element_index === 12) idxArr = getIndex(studydesigns, "Title");
    else if (element_index === 13) idxArr = getIndex(studydesigns, "Date");

    idxArr.forEach((index) => {
      elem = document.querySelector(
        "#tab-body > div > div:nth-child(1) > table > tbody > tr:nth-child(" +
        index +
        ")"
      );
      interElemArr.push(elem);
      elem.style.background = "#fff59d";
    });
  }
  // ratio
  else if (element_index === 9) {
    // n=x인 부분만 쳐야됨
  }
  // objective
  else if (element_index === 10) {
    // elem = document.querySelector("");
    // title과 brief summary에서 가져옴.
  }
  // title
  else if (element_index === 11) {
    elem = document.querySelector("#main-content > div.tr-indent2 > h1");
  }

  //// 공통이 아닌 부분!!
  // 각 군별 intervention과 washout period 처리
  else if (element_index >= intervenStartIndex && element_index < intervenEndIndex) {
    let tags = document.querySelector(
      "#tab-body > div > div:nth-child(3) > table"
    ); // intervention query

    let nthIntervenIndex = element_index - intervenStartIndex;
    let order = element_index - intervenStartIndex;
    if (designModel != "Crossover Assignment")
      order = Math.floor(nthIntervenIndex / 2); // 기간까지 표시하기 위함
    elem = tags.querySelector(
      "tbody > tr:nth-child(" + String(order + 1) + ")"
    );
  }

  // crossover의 washout
  else if (element_index >= intervenEndIndex) {
    // 필요하다면 단어만 하이라이트도 필요. 일단은 표 전체를 하이라이트!
    elem = document.querySelector(
      "#tab-body > div > div:nth-child(3) > table > tbody"
    );
  }

  if (isArr === false) {
    elem.style.background = "#fff59d";
  }

  // remove existing highlight
  for (let q = 1; q < len_annos; q++) {
    if ((q === element_index) || ((element_index >= intervenStartIndex && element_index < intervenEndIndex) && (q === (element_index + 1))) || ((element_index === 4 && q === (element_index + 1)) || (element_index === 5 && q === (element_index - 1)))) {
      // console.log("continue for loop! ", q);
      continue;
    } else {
      let otherElem = getOtherElemes(q, designModel, len_annos, len_interven);
      let singleElem = otherElem[0];
      let multiElem = otherElem[1];
      let isArray = otherElem[2];
      
      if ((isArray === false)) {
        try {
          if (e.annotation.text !== "") {
            // console.log("this is an empty space ", q);
            // console.log(q, " singleElem, ", singleElem);
            singleElem.style.background = "white";

          } else {
            continue;
          }
        } catch (error) {
          // console.log(q, " single error ", result_ele);
          // console.log(error);
          continue;
        }
      } else if (isArray === true) {
        try {
          // console.log("index ", q, " ", multiElem);
          for (let p = 0; p < intervenEndIndex - intervenStartIndex; p++) {
            multiElem[p].style.background = "white";
          }
        } catch (error) {
          // console.log(q, " multi error ", result_ele);
          // console.log(error);
          continue;
        }
      }
    }
  }
}
