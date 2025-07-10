const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL이 필요합니다." });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
  await page.setViewport({ width: 1280, height: 720 });

  const screenshot = await page.screenshot({ fullPage: true });
  await browser.close();

  const base64 = screenshot.toString("base64");
  res.json({ imageUrl: `data:image/png;base64,${base64}` });
};
