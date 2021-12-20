const isNumber = (a) => typeof a === 'number'

export const assertScreenshot = async (identifier, customOptions = {}) => {
  const options = {
    comparisonMethod: 'ssim',
    failureThreshold: 0.01,
    failureThresholdType: 'percent',
  }
  if (identifier) {
    if (customOptions.tag) {
      identifier += `-${customOptions.tag}`
    }
    options.customSnapshotIdentifier = identifier
  }
  const wait = isNumber(customOptions.wait) ? customOptions.wait : 1000
  await page.waitFor(wait)
  const image = await page.screenshot()
  expect(image).toMatchImageSnapshot(options)
}
