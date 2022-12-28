import "./Example.css";
function Example({ name, nctIds, apis, onCreate, onClick }) {
  const handleClick = (e) => {
    let requestJson = {
      api: apis,
      id: e.target.value
    };
    onCreate(requestJson);
    onClick(e.target.value);
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