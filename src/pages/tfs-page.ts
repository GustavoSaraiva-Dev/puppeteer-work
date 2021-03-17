import { Browser } from "puppeteer";

interface PageProps {
  username: string;
  password: string;
  browser: Browser;
}

const tfsPage = async ({ username, password, browser }: PageProps) => {
  const page = await browser.newPage();
  await page.authenticate({
    username: username,
    password: password,
  });
  await page.goto("http://192.168.30.36:8080/tfs/BitCall/DEV/_backlogs");

  await page.waitForSelector(".add-panel-full-width-row-button");
  await page.click(".add-panel-button");
  await page.waitForSelector(
    ".work-item-form.work-item-form-main.no-headertoolbar"
  );
  await page.click(
    'span.menu-item-icon.bowtie-icon.bowtie-ellipsis[aria-label="Actions"]'
  );
  await page.hover('[class="menu sub-menu"] li[aria-posinset="5"]'); //Menu-Template
  await page.waitForSelector(
    '[class="toolbar workitem-tool-bar"] ul > li[aria-label="Actions"] > ul:nth-child(5) [aria-posinset="15"]' //carregando o menu de template
  );
  await page.click(
    '[class="toolbar workitem-tool-bar"] ul > li[aria-label="Actions"] > ul:nth-child(5) [aria-posinset="15"]' //clicando no menu de template
  );

  await page.waitForTimeout(2000);
  await page.click('[aria-label="Title Field"]', { clickCount: 3 });
  await page.keyboard.press("Backspace");
  await page.type('[aria-label="Title Field"]', "Essa é a descrição do item");

  //criar a tag de automático para mim
  await page.click(".bowtie-icon.bowtie-math-plus-light");
  await page.type(".tags-input.tag-box.ui-autocomplete-input", "Automático");
  await page.keyboard.press("Enter", { delay: 1000 });

  const campoDescricao = await page.frames();
  const textbox = await campoDescricao.find((ifr) => ifr.$('[role="textbox"]'));

  await textbox?.click;

  await page.screenshot({ path: "./src/download/example.png" });
};

export default tfsPage;
