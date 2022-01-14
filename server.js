require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;
const puppeteer = require("puppeteer");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: `Server is running on port: ${port}` });
});

app.post("/news", async (req, res) => {
  const newsUrl = req.body.newsUrl;

  if (newsUrl) {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(newsUrl, { waitUntil: "networkidle2" });
    const title = await page.evaluate(
      () => document.getElementsByTagName("h1")[0].textContent
    );
    const paragraphs = await page.evaluate(() =>
      Array.from(document.getElementsByTagName("p")).map(
        (item) => item.textContent
      )
    );

    return res.json({ title, paragraphs });
  } else {
    return res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
