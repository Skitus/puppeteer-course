const { Cluster } = require("puppeteer-cluster");

const urls = [
  "https://www.amazon.com/s?k=Jeans&rh=n%3A1040660%2Cn%3A1048188%2Cp_36%3A-5000&ds=v1%3AZrh2YeJ%2Bmo6tc5p1QJD9idnCpBDTF2pKNTUbGqlhFKk&crid=1TZCO6ZC2HZVA&pd_rd_r=18d34a9e-c4e0-4def-9af2-ab9846891dc7&pd_rd_w=wWV7l&pd_rd_wg=8E0cq&pf_rd_p=b0c3902d-ae70-4b80-8f54-4d0a3246745a&pf_rd_r=ENHTD7BWM0Q527G45BQP&qid=1684823801&rnid=2941120011&sprefix=jeans%2Caps%2C155&ref=pd_gw_unk",
  "https://www.amazon.com/s?k=Tops&rh=p_36%3A-2500&crid=19AKO4YZK6ZPJ&pd_rd_r=18d34a9e-c4e0-4def-9af2-ab9846891dc7&pd_rd_w=wWV7l&pd_rd_wg=8E0cq&pf_rd_p=b0c3902d-ae70-4b80-8f54-4d0a3246745a&pf_rd_r=ENHTD7BWM0Q527G45BQP&qid=1684823853&rnid=2661611011&sprefix=tops%2Caps%2C250&ref=pd_gw_unk",
  "https://www.amazon.com/s?k=Dresses&rh=p_36%3A-3000&crid=Y67PJX929LXO&pd_rd_r=18d34a9e-c4e0-4def-9af2-ab9846891dc7&pd_rd_w=wWV7l&pd_rd_wg=8E0cq&pf_rd_p=b0c3902d-ae70-4b80-8f54-4d0a3246745a&pf_rd_r=ENHTD7BWM0Q527G45BQP&qid=1684823891&rnid=2661611011&sprefix=dresses%2Caps%2C149&ref=pd_gw_unk",
  "https://www.amazon.com/s?k=Shoes&rh=p_36%3A-5000&crid=1QEZIUFPCL3YZ&pd_rd_r=18d34a9e-c4e0-4def-9af2-ab9846891dc7&pd_rd_w=wWV7l&pd_rd_wg=8E0cq&pf_rd_p=b0c3902d-ae70-4b80-8f54-4d0a3246745a&pf_rd_r=ENHTD7BWM0Q527G45BQP&qid=1684823927&rnid=2661611011&sprefix=shoes%2Caps%2C145&ref=pd_gw_unk",
];

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 100,
    puppeteerOptions: {
      headless: false,
      monitor: true,
      defaultViewport: false,
      userDataDir: "./tmp",
    },
  });

  cluster.on("taskerror", (err, data) => {
    console.log(`Error ${data}: ${err.message}`);
  });

  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url);

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
  });

  for (const url of urls) {
    await cluster.queue(url);
  }

  // many more pages

  await cluster.idle();
  await cluster.close();
})();
