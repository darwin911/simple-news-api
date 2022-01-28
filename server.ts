import { Browser } from "puppeteer";
import { Page } from "puppeteer";
import express from "express";
import puppeteer from "puppeteer";
import { uniq } from "lodash";

require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req: any, res: any) => {
  res.json({ message: `Server is running on port: ${port}` });
});

app.post("/news", async (req: any, res: any) => {
  const newsUrl: string = req.body.newsUrl;

  if (newsUrl) {
    const browser: Browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page: Page = await browser.newPage();
    await page.goto(newsUrl, { waitUntil: "networkidle2" });

    const title: string = await page.evaluate(
      () => document.getElementsByTagName("h1")[0].textContent || ""
    );

    const paragraphs: string[] = await page.evaluate(() =>
      Array.from(document.getElementsByTagName("p")).map(
        (item) => item.textContent || ""
      )
    );

    const uniqueParagraphs: string[] = uniq(paragraphs).filter(Boolean);

    const responseData: {
      title: string;
      paragraphs: string[];
    } = { title, paragraphs: uniqueParagraphs };

    return res.json(responseData);
  } else {
    return res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
