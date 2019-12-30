import { mockEmbeddableConfigEndpoint } from './embeddable-config'
import { default as loadWidgetPage } from './loader'

class WidgetBuilder {
  constructor() {
    this.intercepts = []
    this.configs = []
    this.preloads = []
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
    this.configs.push(mockEmbeddableConfigEndpoint(...presets))
    return this
  }

  intercept(interceptor) {
    this.intercepts.push(interceptor)
    return this
  }

  evaluateOnNewDocument(...args) {
    this.preloads.push(args)
    return this
  }

  load() {
    const mockRequests = this.configs.concat(this.intercepts)
    const beforeScriptLoads = page => {
      this.preloads.forEach(async arg => {
        await page.evaluateOnNewDocument(...arg)
      })
    }
    return loadWidgetPage({
      mockRequests,
      beforeScriptLoads,
      hidden: this.hidden,
      mobile: this.mobile
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
