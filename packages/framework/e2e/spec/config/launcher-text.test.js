import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'

const buildWidget = (labelKey) =>
  loadWidget()
    .withPresets('helpCenter', {
      embeds: {
        launcher: {
          props: {
            labelKey,
          },
        },
      },
    })
    .load()

test('when there is no labelKey set, default label says Help', async () => {
  await loadWidget().withPresets('helpCenter').load()
  expect(await launcher.getLabelText()).toEqual('Help')
})

test('when labelKey is feedback, launcher says Feedback', async () => {
  await buildWidget('feedback')
  expect(await launcher.getLabelText()).toEqual('Feedback')
})

test('when labelKey is support, launcher says Support', async () => {
  await buildWidget('support')
  expect(await launcher.getLabelText()).toEqual('Support')
})
