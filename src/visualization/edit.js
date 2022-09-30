export function changeInfoDict(newInfoDict, annot) {
  for (let i = 0; i < annot.length; i++) { // text 정제 작업
    if (annot[i].name?.type === 'PopulationBox') { //population
      const idx = annot[i].text.indexOf(':');
      annot[i].text = annot[i].text.substring(idx + 2);
      newInfoDict.PopulationBox[annot[i].name.inJson] = annot[i].text;
    }
    // intervention
    else if (annot[i].name?.type === 'intervention') {
      if (annot[i].text === 'write text') annot[i].text = '';// write text라 써져있으면 다시 지우기
      newInfoDict[annot[i].name.inJson] = annot[i].text;
    }
    // armGroup
    else if (annot[i].name?.type === 'armGroup') {
      if (annot[i].text === 'write text') annot[i].text = ''; // write text라 써져있으면 지우기

      if (annot[i].name.inJson === 'Duration') {
        newInfoDict.DrugInformation.ArmGroupList[annot[i].name.idx].InterventionDescription[0].Duration = annot[i].text;
      }
      else if (annot[i].name.inJson === 'DrugName') {
        let t = 0;
        while (annot[i].text.includes('+')) { // + 로 찾아
          let idx = annot[i].text.indexOf('+');
          newInfoDict.DrugInformation.ArmGroupList[annot[i].name.idx].InterventionDescription[t].DrugName = annot[i].text.substring(0, idx);//다시 약물 한개씩 쪼개서 집어 넣기
          t++
          annot[i].text = annot[i].text.substring(idx + 1); // 앞에 것 지우기
        }
        newInfoDict.DrugInformation.ArmGroupList[annot[i].name.idx].InterventionDescription[t].DrugName = annot[i].text; // 맨 마지막 것 추가
      }
    }
  }
}

export function moveIdxFront(newInfoDict, clickedBranchIdx) {
  //branch가 붙어있지 않다면 붙어있도록 순서 변경
  clickedBranchIdx =
    clickedBranchIdx[1] > clickedBranchIdx[0]
      ? clickedBranchIdx
      : [...clickedBranchIdx].reverse();
  const armGroupList = newInfoDict.DrugInformation.ArmGroupList;
  const aryToAdd = [];
  for (let i = 1; i >= 0; i--) {
    aryToAdd.push(armGroupList.splice(clickedBranchIdx[i], 1));
  }
  for (let i = 0; i < clickedBranchIdx.length; i++) {
    armGroupList.splice(0, 0, aryToAdd[i][0]);
  }
}





export function removeHtmlTag(annot) {
  const re1 = /<br>/g; //br태그 정규표현식
  const re2 = /<\/?b>/g; //b태그 정규표현식
  const r_aStart = /\<[^)]*'\>/;
  const r_aEnd = /\<\/a>/;

  for (let i = 0; i < annot.length; i++) {
    if (annot[i].text === '') { // 빈 텍스트 값이면
      annot[i].text = 'write text';
      annot[i].bordercolor = '#c7c7c7';
    }
    else { // 빈 텍스트 값이 아니면
      annot[i].text = annot[i].text.replace(re1, ' ');
      annot[i].text = annot[i].text.replace(re2, '');
      annot[i].text = annot[i].text.replace(r_aStart, '');
      annot[i].text = annot[i].text.replace(r_aEnd, '');
    }
  }
}

export function changeCross(currentModel, op = '+') {
  const cross = op === '+' ? {
    Cr: "c2",
    c2: 'c4',
    c4: 'c6',
  } : {
    c2: "Crossover Assignment",
    c4: 'c2',
    c6: 'c4',
  };

  return cross[currentModel.slice(0, 2)];
}

export function makeNewModel(currentModel, numBranch, op) {
  const cross = changeCross(currentModel, op);
  const parallel = cross === 'Crossover Assignment' ? '' : 'p' + (numBranch - Number(cross[1]));
  return cross + parallel;
}