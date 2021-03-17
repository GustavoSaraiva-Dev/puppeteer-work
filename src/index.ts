//import * as puppeteer from 'puppeteer';
import puppeteer from "puppeteer";
import config from "../puppeteer.config.json";

import tfsPage from "./pages/tfs-page";
import topDeskPage from "./pages/top-desk-page";

const pptr = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
  });

  await topDeskPage({
    username: config.user,
    password: config.password,
    browser: browser,
  });
  // await tfsPage({
  //   username: config.user,
  //   password: config.password,
  //   browser: browser,
  // });
  //await browser.close();
};

pptr();
