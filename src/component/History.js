
import "./History.css";

function History({ imgArr }) {
  console.log(imgArr);


  return (
    <ul id="img-list">
      {imgArr.map((el, idx) => {
        return <li key={idx}><img src={`data:image/png;base64,${el}`} alt="img" /></li>
      })}
    </ul>
  );
}

export default History;