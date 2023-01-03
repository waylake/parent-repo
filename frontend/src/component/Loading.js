import { BeatLoader } from "react-spinners"; //$ npm install react-spinners --save
import "./Loading.css";

function Loading() {
  return (
    <div id="loader">
      <BeatLoader
        color="rgba(10, 76, 138, 0.671)"
        height={15}
        width={5}
        radius={2}
        margin={2} />
      <br />
      로딩중입니다
    </div>
  );
}

export default Loading;