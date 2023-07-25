const puppeteer = require("puppeteer");
const fs = require("fs");

const sleep = (waitTimeMs) => {
  return new Promise((resolve) => setTimeout(resolve, waitTimeMs));
};

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  let fileName = "";
  let fileNameDownloaded = false;
  let updatedImage = false;
  let code = false;
  let updateCode = false;

  page.on("response", async (response) => {
    const imageUrl = response.url();
    if (imageUrl.includes("99581b9d446a509a0a01954438a5e36a.jpg")) {
      response.buffer().then((file) => {
        fileName = "./captchas/" + "99581b9d446a509a0a01954438a5e36a.jpg";

        const writeStream = fs.createWriteStream(fileName);
        writeStream.write(file);
        fileNameDownloaded = true;
      });
    }
  });

  await page.goto("https://2captcha.com/demo/normal");

  while (!updatedImage) {
    await sleep(100);
    if (fileName && fileNameDownloaded) {
      updatedImage = true;

      const spawn = require("child_process").spawn;
      const pythonProcess = spawn("python", ["2captcha.py", fileName]);

      pythonProcess.stdout.on("data", (data) => {
        try {
          const res = JSON.parse(data.toString().replace(/'/g, '"'));
          code = res.code;
        } catch (err) {}
      });

      console.log("fileName", fileName);
    }
  }

  while (!updateCode) {
    await sleep(100);
    if (code) {
      updateCode = true;
      console.log(code);
    }
  }

  //await browser.close();
})();
