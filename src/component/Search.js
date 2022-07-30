import styles from "./Search.module.css";
function Search() {
  return <div>
    <input type="text" placeholder="URL 입력" name="url"></input>
    <button type="submit">모식도 생성</button>
  </div>
}

export default Search;