export function pushListElement(putlst, datalst, alpha){
  for(let i=0; i < datalst.length + alpha; i++){
    putlst.push(datalst[i]);
  }
}

export function pushSameElement(putlst, data, amount, alpha){
  for(let i=0; i < amount + alpha; i++){
    putlst.push(data);
  }
}
