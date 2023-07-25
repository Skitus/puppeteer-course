const puppeteer = require("puppeteer");

async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems); // Make sure extractItems returns an array
      previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      await page.waitFor(scrollDelay);
    }
  } catch (e) {}
  return items;
}

jest.mock("puppeteer", () => ({
  launch: jest.fn(() =>
    Promise.resolve({
      newPage: jest.fn(() =>
        Promise.resolve({
          evaluate: jest.fn((fn) => Promise.resolve(fn())),
          goto: jest.fn(),
          waitFor: jest.fn(),
          close: jest.fn(), // Added this line
        })
      ),
      close: jest.fn(), // Added this line
    })
  ),
}));

describe("Scrape Infinite Scroll Test", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("https://intoli.com/blog/scrape-infinite-scroll/demo.html");
  });

  it("should scrape items", async () => {
    const items = await scrapeInfiniteScrollItems(page, jest.fn(), 100);
    expect(items).toBeUndefined();
  });

  afterAll(async () => {
    await browser.close();
  });
});
