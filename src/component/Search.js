import { useState } from "react";
import "./Search.css";

function Search({ onCreate }) {
  const [nctId, setNctId] = useState('');

  const handleNctIdChange = (e) => {
    setNctId(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.url.value.slice(0, 3).toUpperCase() === "NCT")
      onCreate(e.target.url.value.toUpperCase());
    else {
      console.log(e.target.url.value);
      onCreate(e.target.url.value);
    }
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