import { useState } from "react";
import "./Search.css";


function Search({ onCreate }) {
  const [nctId, setNctId] = useState('NCT04577378');

  const handleNctIdChange = (e) => {
    setNctId(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(e.target.url.value.toUpperCase());
    // document.getElementById("clicked").style.cursor="wait";
  }

  return (
    <div className="searchbar">
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="NCTID 입력" name="url" value={nctId} onChange={handleNctIdChange}></input>
        <button type="submit" id="clicked">모식도 생성</button>
      </form>
    </div>

  )
}

export default Search;