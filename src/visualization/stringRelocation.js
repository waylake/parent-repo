import { countLine } from "./drawPopulation";

function stringGoDown(inString, limit, x, y, fontSize, delta) {
  let result = countLine(inString, limit);
  let textList = result[1];
  return textList;
}

