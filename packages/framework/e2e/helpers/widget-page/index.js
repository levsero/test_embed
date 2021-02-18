import { mockEmbeddableConfigEndpoint } from './embeddable-config'
import { default as loadWidgetPage } from './loader'

class WidgetBuilder {
  constructor() {
    this.intercepts = []
    this.configs = []
    this.beforeSnippetScripts = []
    this.afterSnippetScripts = []
    this.mobile = false
    this.hidden = false
  }
  useMobile() {
    this.mobile = true
    return this
  }

  hiddenInitially() {
    this.hidden = true
    return this
  }

  withPresets(...presets) {
    this.configs.push(...presets)
    return this
  }

  intercept(interceptor) {
    this.intercepts.push(interceptor)
    return this
  }

  evaluateOnNewDocument(...args) {
    return this.evaluateBeforeSnippetLoads(...args)
  }

  // use this helper for setting window.zESettings
  evaluateBeforeSnippetLoads(...args) {
    this.beforeSnippetScripts.push(args)
    return this
  }

  // use this helper for queueing prerender zE() API function calls
  evaluateAfterSnippetLoads(...args) {
    this.afterSnippetScripts.push(args)
    return this
  }

  load() {
    const configs = this.configs.length > 0 ? [mockEmbeddableConfigEndpoint(...this.configs)] : []
    const mockRequests = configs.concat(this.intercepts)
    const beforeSnippetLoads = (page) => {
      this.beforeSnippetScripts.forEach(async (arg) => {
        await page.evaluateOnNewDocument(...arg)
      })
    }
    const afterSnippetLoads = (page) => {
      this.afterSnippetScripts.forEach(async (arg) => {
        await page.evaluate(...arg)
      })
    }
    return loadWidgetPage({
      mockRequests,
      beforeSnippetLoads,
      afterSnippetLoads,
      hidden: this.hidden,
      mobile: this.mobile,
    })
  }
}

const loadWidget = (...args) => {
  const builder = new WidgetBuilder()
  if (args.length > 0) {
    return builder.withPresets(...args).load()
  } else {
    return builder
  }
}

export default loadWidget
