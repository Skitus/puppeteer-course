const puppeteer = require("puppeteer");

const sleep = (milisecond) => {
  return new Promise((resolve) => setTimeout(resolve, milisecond));
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "/home/artur/.config/google-chrome/Profile 1",
  });
  const page = await browser.newPage();
  //https://accounts.google.com/signin/v2/identifier
  await page.goto("https://accounts.google.com/signin/v2/identifier", {
    waitUntil: "networkidle0",
  });

  await page.type("#identifierId", "artur.demenskiy03@gmail.com");
  await page.click("#identifierNext");
  await page.waitForNavigation({
    waitUntil: "load",
  });

  await page.waitForSelector("#password", {
    visible: true,
    hidden: false,
  });

  await page.type(
    "#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input",
    "A20033002D"
  );
  await page.click("#passwordNext > div > button");

  await sleep(3000);

  const cookies = await page.cookies();
  console.log("cookies", cookies);

  await browser.close();
})();
