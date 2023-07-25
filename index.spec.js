// Основной файл index.js
const fs = require("fs");
const puppeteer = require("puppeteer");

async function getProductInfo(page, productHandle) {
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
      const priceElement = el.querySelector("span.a-price span.a-offscreen");
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

  return { title, price, image };
}

// Дальше идет твой основной код

// Тестовый файл index.test.js

jest.mock("puppeteer", () => ({
  launch: jest.fn(() =>
    Promise.resolve({
      newPage: jest.fn(() =>
        Promise.resolve({
          evaluate: jest.fn(() => Promise.resolve("dummy value")),
        })
      ),
      close: jest.fn(),
    })
  ),
}));

describe("Amazon Scraper", () => {
  let mockPage;

  beforeEach(() => {
    mockPage = {
      evaluate: jest.fn(() => Promise.resolve("dummy value")),
    };
  });

  it("should extract product info", async () => {
    const mockHandle = {};
    const info = await getProductInfo(mockPage, mockHandle);
    expect(info).toEqual({
      title: "dummy value",
      price: "dummy value",
      image: "dummy value",
    });
    expect(mockPage.evaluate).toHaveBeenCalledTimes(3);
  });
});
