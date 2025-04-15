require("dotenv").config(); // .env 파일의 환경변수 불러오기

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// 모든 요청에 대해 CORS 허용
app.use(cors());
app.use(express.json());

// 정적 파일 제공: public 폴더 내 파일들 (index.html, style.css, script.js)
app.use(express.static("public"));

app.get("/api/content", async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY가 .env 파일에 정의되어 있지 않습니다.");
    }

    const apiUrl = "https://www.youthcenter.go.kr/go/ythip/getContent";

    // 클라이언트에서 전달한 쿼리값 사용. 기본값은 각각 "1", "10", "1"로 설정
    const { pageNum = "1", pageSize = "10", pageType = "1" } = req.query;
    const params = {
      apiKeyNm: apiKey,
      rtnType: "json",
      pageNum: pageNum,
      pageSize: pageSize,
      pageType: pageType,
    };

    const response = await axios.get(apiUrl, { params });
    res.json(response.data);
  } catch (error) {
    console.error("프록시 서버 오류:", error.message);
    res.status(500).json({ message: "프록시 서버 오류", error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`프록시 서버 실행 중: http://localhost:${PORT}`);
});
