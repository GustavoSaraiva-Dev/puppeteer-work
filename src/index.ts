//import * as puppeteer from 'puppeteer';
import puppeteer from "puppeteer";
import config from "../puppeteer.config.json";

const pptr = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });
  await page.goto("https://solfarma.topdesk.net/tas/secure/login/form");

  await page.type("#loginname", config.user, { delay: 3 });
  await page.type("#password", config.password, { delay: 1 });
  await page.click(".button#login");

  await page.waitForTimeout(10000);

  const frameHAndle = await page.$("iframe");
  const iframe = await frameHAndle?.contentFrame();
  console.log(iframe);

  await iframe?.$eval(
    `div [mtype="label"][mangoinfobox="Filtrar: não resolvido"]`,
    (e) => e.classList
  );

  //await page.screenshot({ path: './src/download/example.png' });

  //await browser.close();
};

pptr();
