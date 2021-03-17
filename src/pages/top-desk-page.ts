import { Browser, ElementHandle, Frame } from "puppeteer";
import fs from "fs";
import path from "path";
interface PageProps {
  username: string;
  password: string;
  browser: Browser;
}

const topDeskPage = async ({ username, password, browser }: PageProps) => {
  const page = await browser.newPage();
  await page.goto("https://solfarma.topdesk.net/tas/secure/login/form");

  //#region Ação de Login
  await page.waitForSelector(".textbox.logintextbox#loginname");
  const usernameInput = await page.$(".textbox.logintextbox");
  await usernameInput?.type(`${username}`);

  const passwordInput = await page.$(".textbox.logintextbox#password");
  await passwordInput?.type(`${password}`);

  await page.click(".button#login");
  //#endregion

  //#region Olha todos os atendimentos
  await page.waitForSelector(`[guielement="toplevelwindow"]`);
  console.log("Aguardou a página");

  await page.waitForSelector(
    `div[aria-label="Tarefas pendentes: 'Atendimentos' de 1º nível (Próprios)"]`
  );
  await page.waitForTimeout(5000);
  console.log("Aguardou o botão");
  await page.click(
    `div[aria-label="Tarefas pendentes: 'Atendimentos' de 1º nível (Próprios)"]`
  );

  await page.waitForTimeout(5000);
  console.log("Aguardou 5 segundos");

  const frames = page.frames(); //Pega todos iframes da página;

  /*Função Responsável por encontrar os atendimentos dentro do iframe */

  var bottomBar: ElementHandle<Element> | null;

  frames.forEach(async (f) => {
    const frameTitle = await f.title();

    if (frameTitle === "Conteúdo da visão geral") {
      const containerAtendimentos: ElementHandle<Element> | null = await f.$(
        "#_naam.column"
      );

      const colunasAtendimentos: ElementHandle<Element>[] | null = await f.$$(
        `[aria-label="'Atendimentos' de 1º nível"] div[aria-hidden="true"]`
      );

      colunasAtendimentos.forEach(async (atendimento) => {
        await atendimento.evaluate((el: HTMLElement) =>
          console.log(el.innerHTML)
        );
      });

      // const tableAtendimentos:
      //   | ElementHandle<Element>[]
      //   | undefined = await divAtendimetos?.$$(`[aria-hidden="true"]`);

      // tableAtendimentos?.forEach(
      //   async (ate) =>
      //     await ate?.evaluate((el: HTMLElement) => {
      //       console.log(el.innerHTML);
      //     })
      // );

      //aria-hidden="true"

      const atendimentos:
        | ElementHandle<Element>[]
        | undefined = await containerAtendimentos?.$$("span");

      // atendimentos?.forEach(async (at) => {
      //   const myinner = await at.evaluate((el: HTMLElement) => el.innerText);
      //   console.log(myinner);

      // });
    }
  });

  //#region Salva as informações dos atendimentos

  //#endregion

  const storeData = (data: object | undefined) => {
    try {
      let strJsn = JSON.stringify(data);
      fs.appendFile(path.resolve(__dirname, "data.json"), strJsn, () => {
        console.log("Saved");
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export default topDeskPage;
