import { createEmbeddableConfig, mockEmbeddableConfigEndpoint } from './embeddable-config'
import { goToTestPage } from './../utils'

const loadWithConfig = async (...configs) => {
  await jestPuppeteer.resetPage()
  await mockEmbeddableConfigEndpoint(createEmbeddableConfig(...configs))
  await goToTestPage()
  await page.waitForSelector('iframe#launcher', { visible: true })
}

export default {
  loadWithConfig
}
