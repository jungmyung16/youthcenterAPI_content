let currentPage = 1;
const pageSize = 30; // 페이지당 30개씩 보기

function loadData(page) {
  currentPage = page || 1;
  // 쿼리스트링에 페이지 번호와 페이지 크기를 반영
  const apiUrl = `/api/content?pageNum=${currentPage}&pageSize=${pageSize}&pageType=1`;
  const contentEl = document.getElementById("content");
  contentEl.innerHTML = '<div class="loader"></div>';

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("네트워크 응답이 정상이 아닙니다.");
      }
      return response.json();
    })
    .then((data) => {
      if (!data.result) {
        throw new Error("올바른 데이터 구조가 아닙니다.");
      }
      const { resultCode, resultMessage, result } = data;
      const { pagging, youthPolicyList } = result;

      let html = `
        <div class="api-info">
          <h2>API 응답 정보</h2>
          <p><strong>결과 코드:</strong> ${resultCode}</p>
          <p><strong>결과 메시지:</strong> ${resultMessage}</p>
        </div>
      `;

      if (pagging) {
        html += `
          <div class="pagging-info">
            <h3>페이징 정보</h3>
            <p><strong>총 개수:</strong> ${pagging.totCount}</p>
            <p><strong>현재 페이지:</strong> ${pagging.pageNum}</p>
            <p><strong>페이지 크기:</strong> ${pagging.pageSize}</p>
          </div>
        `;
      }

      if (youthPolicyList && youthPolicyList.length > 0) {
        // atchFile 필드 제거
        const cleanedList = youthPolicyList.map((item) => {
          const { atchFile, ...rest } = item;
          return rest;
        });
        html += "<table>";
        // 헤더: 첫 번째 행은 컬럼명, 두 번째 행은 컬럼 설명
        html += "<thead>";
        const keys = Object.keys(cleanedList[0]);
        // 첫 번째 헤더 행: 컬럼명
        html += "<tr>";
        keys.forEach((key) => {
          html += `<th>${key}</th>`;
        });
        html += "</tr>";
        // 두 번째 헤더 행: 각 컬럼에 대한 간략한 설명
        const columnDescriptions = {
          bbsSn: "게시판 일련번호",
          pstSn: "게시물 일련번호",
          pstSeSn: "게시물 구분 일련번호",
          pstSeNm: "게시물 구분 이름",
          pstTtl: "게시물 제목",
          pstWholCn: "게시물 전체 내용",
          pstInqCnt: "게시물 조회 수",
          pstUrlAddr: "게시물 URL 주소",
          frstRgtrNm: "최초 등록자 명",
          frstRegDt: "최초 등록 일시",
          lastMdfrNm: "최종 수정자 명",
          lastMdfcnDt: "최종 수정 일시",
        };
        html += "<tr>";
        keys.forEach((key) => {
          const desc = columnDescriptions[key] || "설명이 없습니다.";
          // 스타일은 CSS에서 따로 지정해도 되고, 여기서 인라인으로 지정할 수도 있습니다.
          html += `<th style="font-size:12px; font-weight:normal;">${desc}</th>`;
        });
        html += "</tr>";
        html += "</thead>";
        // 바디: 각 데이터 행
        html += "<tbody>";
        cleanedList.forEach((item) => {
          html += "<tr>";
          keys.forEach((key) => {
            let value = item[key];
            if (value === null || value === undefined || value === "") {
              value = "데이터가 없습니다.";
            } else if (typeof value === "object") {
              value = JSON.stringify(value);
            }
            html += `<td>${value}</td>`;
          });
          html += "</tr>";
        });
        html += "</tbody>";
        html += "</table>";
      } else {
        html += "<p>데이터가 없습니다.</p>";
      }

      // 페이지네이션 버튼 추가
      const totCount = pagging ? pagging.totCount : 0;
      const totPages = Math.ceil(
        totCount / (pagging ? pagging.pageSize : pageSize)
      );
      html += `<div class="pagination" style="text-align:center; margin-top:20px;">`;
      if (currentPage > 1) {
        html += `<button id="prevPage">이전 페이지</button>`;
      }
      if (currentPage < totPages) {
        html += `<button id="nextPage">다음 페이지</button>`;
      }
      html += `</div>`;

      contentEl.innerHTML = html;

      // 페이지네이션 버튼 이벤트 등록
      const prevBtn = document.getElementById("prevPage");
      const nextBtn = document.getElementById("nextPage");
      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          loadData(currentPage - 1);
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          loadData(currentPage + 1);
        });
      }
    })
    .catch((error) => {
      console.error("데이터 불러오기 실패:", error);
      contentEl.innerHTML =
        '<div class="error-message">데이터를 불러오는데 실패했습니다.</div>';
    });
}

document.getElementById("loadData").addEventListener("click", function () {
  loadData(1);
});
