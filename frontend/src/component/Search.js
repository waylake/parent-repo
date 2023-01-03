import { useState } from "react";
import "./Search.css";
import Example from "./Example";


function Search({ onCreate }) {
  const [nctId, setNctId] = useState();
  const [apis, setApis] = useState(["biolink"]);

  const handleCheck = (e) => {
    if (e.target.checked) {
      const newApis = [...apis, e.target.value];
      setApis(newApis);
    }
    else {
      const newApis = apis.filter((api) => e.target.value !== api);
      setApis(newApis);
    }
  }

  const handleNctIdChange = (e) => {
    setNctId(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // acm과 biolinkbert 둘다 선택이 안되었을 때 예외 처리
    if (!apis) {
      alert("please select at least one api");
      return;
    }

    // nctId가 url인 경우 nctId만 추출
    const reg = /NCT[0-9]{8}/;
    const val = nctId.match(reg);

    // 만약 nctid가 포함되어있지 않은 검색이면 예외처리
    if (!val) {
      alert("NCTID가 포함된 url 또는 NCTID를 입력해주세요");
      return;
    }


    const requestJson = {
      api: apis,
      id: val[0].toUpperCase()
    };

    console.log("requestJson: ", requestJson);
    onCreate(requestJson);
  }

  const handleExampleClick = (nct) => {
    setNctId(nct);
  }

  return (
    <div className="searchbar">
      <form onSubmit={handleSubmit}>
        <svg id="glass" version="1.0" xmlns="http://www.w3.org/2000/svg"
          width="1235.000000pt" height="1280.000000pt" viewBox="0 0 1235.000000 1280.000000"
          preserveAspectRatio="xMidYMid meet">
          <metadata>
            Created by potrace 1.15, written by Peter Selinger 2001-2017
          </metadata>
          <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
            fill="#000000" stroke="none">
            <path d="M4165 12794 c-597 -44 -1068 -167 -1560 -409 -296 -146 -568 -322
-805 -524 -137 -116 -564 -517 -687 -645 -535 -557 -899 -1270 -1042 -2041
-77 -417 -88 -879 -31 -1305 165 -1238 869 -2348 1930 -3043 214 -140 501
-290 735 -385 901 -365 1919 -405 2825 -111 335 109 659 264 951 454 l96 63
799 -812 c3638 -3694 3874 -3932 3925 -3963 91 -54 134 -66 244 -66 94 -1 105
2 175 35 78 36 87 43 351 289 176 163 197 186 228 247 74 145 63 324 -27 460
-16 23 -962 990 -2103 2149 -1141 1158 -2181 2216 -2312 2349 l-239 243 69 78
c383 436 681 997 839 1576 207 764 186 1598 -58 2357 -360 1120 -1161 2051
-2213 2570 -457 225 -903 356 -1425 416 -120 14 -561 26 -665 18z m122 -1234
c655 -54 1242 -275 1757 -661 818 -615 1315 -1537 1364 -2529 38 -770 -178
-1487 -628 -2088 -138 -185 -228 -271 -403 -387 -426 -281 -904 -454 -1411
-510 -259 -29 -643 -16 -911 30 -1331 230 -2423 1277 -2720 2609 -59 268 -69
364 -69 711 0 282 3 337 22 462 90 573 298 1067 630 1491 127 163 173 210 287
291 601 430 1354 640 2082 581z"/>
          </g>
        </svg>

        <input type="text" placeholder="Enter NCTID or ClinicalTrial's gov URL" name="url" value={nctId} onChange={handleNctIdChange}></input>
        <div id="selectAPI">
          <span>
            <input type="checkbox" name="api" value="biolink" checked ></input>
            <label for="biolink">ACM+Biolinkbert</label>
          </span>
          <span>
            <input type="checkbox" name="api" value="acm" onChange={handleCheck}></input>
            <label for="acm">Only ACM</label>
          </span>
        </div>
        <button type="submit" id="clicked">모식도 생성</button>
      </form>
      <div className="example">
        <Example name="Single Group" apis={apis} nctIds={['NCT05446467', 'NCT03727152', 'NCT03457311']} onCreate={onCreate} onClick={handleExampleClick} />
        <Example name="Crossover" apis={apis} nctIds={['NCT01610557', 'NCT04450953', 'NCT00400023']} onCreate={onCreate} onClick={handleExampleClick} />
        <Example name="Parallel" apis={apis} nctIds={['NCT05626283', 'NCT05572060', 'NCT01723228']} onCreate={onCreate} onClick={handleExampleClick} />
      </div>
    </div>

  )
}

export default Search;