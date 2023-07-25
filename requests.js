const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    args: ["--no-sandbox", "--disable-setupid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on("request", (request) => {
    const urls = request.url();
    // https://encrypted-tbn0.gstatic.com/images
    if (request.resourceType() === "image") {
      console.log(urls);
      request.abort();
    } else {
      request.continue();
    }
  });

  //   page.on("response", (response) => {
  //     const urls = response.url();
  //     // https://encrypted-tbn0.gstatic.com/images
  //     if (urls.includes("https://www.google.com")) {
  //       console.log(urls);
  //       console.log("method", request.method());
  //       console.log("headers", request.method());
  //     }
  //   });

  await page.goto(
    "https://www.google.com/search?q=mountain&tbm=isch&sa=X&ved=2ahUKEwjlqojrkKKAAxXnGRAIHSOIBUUQ0pQJegQIExAB&biw=1678&bih=891&dpr=1.1"
  );
})();
