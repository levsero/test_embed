const DEVTOOLS_RTT_ADJUSTMENT_FACTOR = 3.75
const DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR = 0.9

// https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/configuration.md
// https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/default-config.js

module.exports = {
  extends: 'lighthouse:default',
  settings: {
    emulatedFormFactor: 'desktop',
    throttlingMethod: 'devtools',
    throttling: {
      // throttling using: mobileSlow4G - https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/constants.js
      rttMs: 150,
      throughputKbps: 1.6 * 1024,
      requestLatencyMs: 150 * DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
      downloadThroughputKbps: 1.6 * 1024 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
      uploadThroughputKbps: 750 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
      cpuSlowdownMultiplier: 4
    },
    onlyAudits: [
      'first-meaningful-paint',
      'largest-contentful-paint',
      'speed-index',
      'first-cpu-idle',
      'interactive',
      'total-blocking-time',
      'bootup-time',
      'network-requests',
      'total-byte-weight'
    ]
  },
  passes: [
    {
      passName: 'WebWidgetPass',
      recordTrace: true,
      useThrottling: true,
      pauseAfterLoadMs: 2000,
      networkQuietThresholdMs: 2000,
      cpuQuietThresholdMs: 2000,
      gatherers: [
        'css-usage',
        'js-usage',
        'viewport-dimensions',
        'runtime-exceptions',
        'console-messages',
        'anchor-elements',
        'image-elements',
        'link-elements',
        'meta-elements',
        'script-elements',
        'iframe-elements',
        'main-document-content'
      ]
    }
  ]
}
