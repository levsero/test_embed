import loadWidget from 'e2e/helpers/widget-page'

test('prerender queue is used', async () => {
  await loadWidget()
    .dontWaitForLauncherToLoad()
    .withPresets('helpCenter')
    .evaluateAfterSnippetLoads(() => {
      zE('webWidget', 'open')
      zE(() => {})
    })
    .load()
  const frame = await getAssetComposerFrame()
  const queue = await frame.evaluate(() => document.zEQueue)

  expect(queue.length).toEqual(2)
  expect(queue[0]).toEqual({
    0: 'webWidget',
    1: 'open',
  })
})

const getAssetComposerFrame = async () => {
  for (const frame of page.mainFrame().childFrames()) {
    const name = await frame.name()
    if (name !== 'launcher' && name !== 'webWidget') {
      return frame
    }
  }
}
