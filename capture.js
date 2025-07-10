const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL 파라미터가 필요합니다." });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new", // 최신 headless 모드
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // User-Agent 설정 (bot 차단 우회)
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );

    // 뷰포트 설정
    await page.setViewport({ width: 1280, height: 720 });

    // 페이지 이동 (빠른 로딩용 waitUntil 옵션 조정)
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    // 스크린샷 (상단만 캡처)
    const buffer = await page.screenshot({ fullPage: false });

    await browser.close();

    const base64 = buffer.toString("base64");
    res.status(200).json({ imageUrl: `data:image/png;base64,${base64}` });
  } catch (err) {
    console.error("캡처 오류:", err.message);
    res.status(500).json({ error: err.message });
  }
};
