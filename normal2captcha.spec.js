const puppeteer = require("puppeteer");
const fs = require("fs");
const { spawn } = require("child_process");

describe("Page Test", () => {
  let browser, page;

  beforeAll(async () => {
    jest.setTimeout(30000);
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should download the image", async () => {
    let fileNameDownloaded = false;
    page.on("response", async (response) => {
      const imageUrl = response.url();
      if (imageUrl.includes("99581b9d446a509a0a01954438a5e36a.jpg")) {
        response.buffer().then((file) => {
          const fileName = "./captchas/" + "99581b9d446a0a01954438a5e36a.jpg";
          const writeStream = fs.createWriteStream(fileName);
          writeStream.write(file);
          fileNameDownloaded = true;
        });
      }
    });

    await page.goto("https://2captcha.com/demo/normal");
    await new Promise((r) => setTimeout(r, 2000)); // wait for a while
    expect(fileNameDownloaded).toBe(true);
  });

  // and so on for the other tests...
});
