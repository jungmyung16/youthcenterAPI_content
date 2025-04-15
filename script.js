// API 키는 빌드 환경에서 .env 파일로 관리되고, 번들러를 통해 전역 변수(API_KEY) 혹은 process.env를 통해 주입된다고 가정합니다.
document.getElementById("loadData").addEventListener("click", function () {
  // API 키를 환경변수에서 주입받는다고 가정. (예: API_KEY 또는 process.env.API_KEY)
  const apiKey = "befccdfe-8ea0-4d7a-9b4f-a05ce812d916"; // 실제 환경에서는 빌드 시 대체됨.
  const apiUrl = "https://www.youthcenter.go.kr/go/ythip/getContent";

  // 요청 파라미터 구성 (필수: apiKeyNm, rtnType; 선택: pageNum, pageSize, pageType)
  const params = new URLSearchParams({
    apiKeyNm: apiKey,
    rtnType: "json",
    pageNum: "1",
    pageSize: "10",
    pageType: "1",
  });

  // 로딩 애니메이션 표시
  const contentEl = document.getElementById("content");
  contentEl.innerHTML = '<div class="loader"></div>';

  fetch(apiUrl + "?" + params.toString())
    .then((response) => {
      if (!response.ok) {
        throw new Error("네트워크 응답이 정상이 아닙니다.");
      }
      return response.json();
    })
    .then((data) => {
      // API 응답 JSON 구조에 따라 결과 배열 추출
      let items = [];
      if (data.result && Array.isArray(data.result)) {
        items = data.result;
      } else if (Array.isArray(data)) {
        items = data;
      } else if (data) {
        items = [data];
      }

      // 각 아이템에서 불필요한 atchFile 필드 제거
      items = items.map((item) => {
        const { atchFile, ...filtered } = item;
        return filtered;
      });

      // 테이블 생성 (데이터가 있을 경우)
      let html = "";
      if (items.length > 0) {
        html += "<table>";
        html += "<thead><tr>";
        Object.keys(items[0]).forEach((key) => {
          html += `<th>${key}</th>`;
        });
        html += "</tr></thead>";
        html += "<tbody>";
        items.forEach((item) => {
          html += "<tr>";
          Object.values(item).forEach((value) => {
            html += `<td>${value !== null ? value : ""}</td>`;
          });
          html += "</tr>";
        });
        html += "</tbody>";
        html += "</table>";
      } else {
        html = "<p>데이터가 없습니다.</p>";
      }

      contentEl.innerHTML = html;
    })
    .catch((error) => {
      console.error("데이터 불러오기 실패:", error);
      contentEl.innerHTML = "<p>데이터를 불러오는데 실패했습니다.</p>";
    });
});
