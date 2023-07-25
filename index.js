const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: "./tmp",
  });

  const page = await browser.newPage();

  let items = [];

  for (let pageNumber = 1; pageNumber <= 7; pageNumber++) {
    await page.goto(
      `https://www.amazon.com/s?k=gaming+chairs&page=${pageNumber}&qid=1234567890`
    );

    await page.screenshot({ path: "example.png" });

    const productsHandles = await page.$$(
      "div.s-main-slot.s-result-list.s-search-results.sg-row > div[data-asin]"
    );

    for (const productHandle of productsHandles) {
      let title = "NUll";
      let price = "NUll";
      let image = "NUll";
      try {
        title = await page.evaluate((el) => {
          const titleElement = el.querySelector(
            "h2 a.a-link-normal.a-text-normal span.a-size-base-plus"
          );
          return titleElement ? titleElement.textContent.trim() : "";
        }, productHandle);
      } catch (e) {
        console.log("Error:", e);
      }

      try {
        price = await page.evaluate((el) => {
          const priceElement = el.querySelector(
            "span.a-price span.a-offscreen"
          );
          return priceElement ? priceElement.textContent.trim() : "";
        }, productHandle);
      } catch (e) {
        console.log("Error:", e);
      }

      try {
        image = await page.evaluate((el) => {
          const imageElement = el.querySelector("img.s-image");
          return imageElement ? imageElement.src : "";
        }, productHandle);
      } catch (e) {
        console.log("Error:", e);
      }

      console.log("Title:", title);
      console.log("Price:", price);
      console.log("Image URL:", image);

      items.push({ title, price, image });

      fs.appendFile(
        "message.text",
        `${title},${price},${image}\n`,
        function (err) {
          if (err) throw err;
          console.log("Saved !");
        }
      );
    }
  }

  console.log("items.length", items.length);

  await browser.close();
})();
