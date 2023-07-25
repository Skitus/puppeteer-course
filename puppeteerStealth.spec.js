const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

describe("Stealth Plugin Test", () => {
  let browser;
  let page;

  beforeAll(async () => {
    jest.setTimeout(30000);
    browser = await puppeteer.launch({
      headless: true,
      executablePath: "/opt/google/chrome/google-chrome",
      userDataDir: "/home/artur/.config/google-chrome/Profile 1",
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  it("should load bot.sannysoft.com and take screenshot", async () => {
    try {
      await page.goto("https://bot.sannysoft.com", { timeout: 60000 });
      await page.waitForTimeout(5000);
      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot).toBeDefined();

      // additional check: make sure there's an expected element in the page
      const element = await page.$("h1");
      expect(element).not.toBeNull();

      // check the text of the element
      const text = await page.evaluate(
        (element) => element.textContent,
        element
      );
      expect(text).toBe("Intoli.com tests + additions");
    } catch (error) {
      throw new Error(`Test failed: ${error.message}`);
    }
  });

  afterAll(async () => {
    await browser.close();
  });
});
