import express from "express";
import fs from "node:fs";
import path from "node:path";

const { exec } = require("child_process");

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
    const filePath: string = "bin/index.html";

    exec(`curl ${newsUrl}`, (error: any, stdout: any) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }

      fs.writeFile(filePath, stdout, (err: any) => {
        if (err) return console.error(err);

        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            return res.sendFile(path.join(__dirname, "index.html"));
          }
        });
      });
    });
  } else {
    return res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
