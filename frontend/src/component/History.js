
import "./History.css";

function History({ imgArr, nctArr, onClick }) {


  const handleClick = (e) => {
    let requestJson = {
      api: ["biolink"],
      id: e.target.alt
    };

    onClick(requestJson);
  }



  return (
    <ul id="img-list">
      {imgArr.map((el, idx) => {
        return <li key={idx} onClick={handleClick} ><img src={`data:image/png;base64,${el}`} alt={nctArr[idx]} /></li>
      })}
    </ul>
  );
}

export default History;