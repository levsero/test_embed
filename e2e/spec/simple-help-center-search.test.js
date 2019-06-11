jest.setTimeout(global.puppeteerTimeout);
import { queries, wait } from 'pptr-testing-library';
import WidgetHelper from '../helper/widgetHelper';
import { embeddableConfigResponse } from '../fixtures/widget.config.response';

describe('Help Center Smoke test', () => {
  let page;

  beforeEach(async () => {
    page = await global.puppeteerBrowser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url().includes('config')) {
        request.respond(embeddableConfigResponse);
      } else {
        request.continue();
      }
    });
  });

  afterEach(async () => {
    await page.close();
  });

  it('searches the Help Center', async () => {
    await page.goto(`${global.puppeteerDevServer}/e2e.html`);
    await page.waitForSelector('iframe#launcher');

    const widgetHelper = new WidgetHelper(page);
    const widget = await widgetHelper.getDocumentHandle(widgetHelper.widgetFrame);

    await widgetHelper.clickLauncherPill();
    const helpCenterSearchInput = await queries.getByPlaceholderText(widget, 'How can we help?');

    await helpCenterSearchInput.type('welcome');
    page.keyboard.press('Enter');
    await wait(() => queries.getByText(widget, 'Top results'));
    await wait(async () => {
      expect(await queries.queryByText(widget, 'Welcome to your Help Center!')).toBeTruthy();
    });
  });
});
