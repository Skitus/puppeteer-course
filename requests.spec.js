describe("Google Images Test", () => {
  beforeAll(async () => {
    jest.setTimeout(10000);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.resourceType() === "image") request.abort();
      else request.continue();
    });
  });

  it("should open the page", async () => {
    try {
      await page.goto(
        process.env.TEST_URL ||
          "https://www.google.com/search?q=mountain&tbm=isch"
      );
    } catch (error) {
      throw new Error("Failed to open the page: " + error.message);
    }
  });

  it("should have the correct page title", async () => {
    try {
      await expect(page.title()).resolves.toMatch("mountain - Google Search");
    } catch (error) {
      throw new Error("Failed to verify the page title: " + error.message);
    }
  });
});
