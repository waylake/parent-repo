function getIndex(queryArr, targetStr){
  let arr = [];
  for(let q = 0; q<queryArr.length; q++){
    let str = queryArr[q].innerText;
    if(str.includes(targetStr)){
      arr.push(q+1);
    }
  }
  return arr;
}

export function highlight(e, clicked, infos) {
  let annotations = document.getElementsByClassName("annotation");
  let len_annos = annotations.length;
  // console.log(annotations);

  let isArr = false;

  let designModel = infos.DesignModel;
  let len_interven = infos.DrugInformation.ArmGroupList.length;
  
  if (designModel === "Single Group Assignment") {
  } else if (designModel === "Crossover Assignment") {
  } else {
    //parallel, sequential and others
    let intervenStartIndex = len_annos - len_interven * 2;
    let elem

    // condition
    if (e.index === 1) {
      elem = document.querySelector("#tab-body > div > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1) > span")
    }
    // gender, healthy volunteer
    else if (e.index >= 2 && e.index <= 3) {
      let tags = document.querySelector(
        "#tab-body > div > div:nth-child(9) > div:nth-child(6) > table > tbody"
      );
      let order = e.index;
      elem = tags.querySelector(
        "tr:nth-child("+ String(order) + ")"
      );
    }
    // min & max age
    else if(e.index >= 4 && e.index <= 5){
      elem = document.querySelector(
        "#tab-body > div > div:nth-child(9) > div:nth-child(6) > table > tbody > tr:nth-child(1)"
      );
    }
    // masking, enrollment, allocation, officialTitle, duration
    else if((e.index >= 6 && e.index <=8) || e.index === 12 || e.index ===13){
      isArr = true; // not to implement style change in bottom of file.
      let studydesigns = document.querySelectorAll("#tab-body > div > div:nth-child(1) > table > tbody > tr");
      let idx;
      if(e.index === 6) idx = getIndex(studydesigns, "Masking");
      else if(e.index === 7) idx = getIndex(studydesigns, "Enrollment");
      else if(e.index === 8) idx = getIndex(studydesigns, "Allocation");
      else if(e.index === 12) idx = getIndex(studydesigns, "Title");
      else if(e.index === 13) idx = getIndex(studydesigns, "Date");

      idx.forEach(index => {
        elem = document.querySelector("#tab-body > div > div:nth-child(1) > table > tbody > tr:nth-child("+index+")");
        elem.style.background = "#fff59d";
      })
    }
    // participant enrollment number
    else if(e.index === 7){
      elem = document.querySelector("#tab-body > div > div:nth-child(1) > table > tbody > tr:nth-child(2)");
    }
    // allocation
    else if(e.index === 8){
      elem = document.querySelector("#tab-body > div > div:nth-child(1) > table > tbody > tr:nth-child(3)");
    }
    // ratio
    else if(e.index === 9){
      // n=x인 부분만 쳐야됨
    }
    // objective
    else if(e.index === 10){
      elem = document.querySelector("");
    }
    // title
    else if(e.index === 11){
      elem = document.querySelector("#main-content > div.tr-indent2 > h1");
    }
    // official title
    else if(e.index === 12){
      elem = document.querySelector("#tab-body > div > div:nth-child(1) > table > tbody > tr:nth-child(9)");
    }
    // duration
    else if(e.index === 13){
      for(let i=0; i<3; i++){
        elem = document.querySelector("#tab-body > div > div:nth-child(1) > table > tbody > tr:nth-child("+String(10+i)+")");
        elem.style.background = "#fff59d";
      }
    }
    // intervention highlight
    else if (e.index >= intervenStartIndex) {
      let tags = document.querySelector(
        "#tab-body > div > div:nth-child(3) > table"
      ); // intervention query

      let nthIntervenIndex = e.index - intervenStartIndex;
      let order = Math.floor(nthIntervenIndex / 2); // 기간까지 표시하기 위함
      elem = tags.querySelector(
        "tbody > tr:nth-child(" + String(order + 1) + ")"
      );
    }

    // based on query 'elem', change background color!
    if(isArr === false) elem.style.background = "#fff59d";
  }
}
