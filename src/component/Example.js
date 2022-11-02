import "./Example.css";
function Example({ name, nctIds, onClick }) {
  const handleClick = (e) => {
    let requestJson = {
      api : "acm",
      url: e.target.value
    };
    onClick(requestJson);
  }
  return (
    <div className="hover-div">
      {name}
      <div className="btn-group">
        {
          nctIds.map((nctId) => {
            return <button onClick={handleClick} key={nctId} value={nctId}>{nctId}</button>
          })
        }
      </div>
    </div>
  )
}

export default Example;