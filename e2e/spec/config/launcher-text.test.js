import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'

const buildWidget = labelKey =>
  loadWidget()
    .withPresets('helpCenter', {
      embeds: {
        launcher: {
          props: {
            labelKey
          }
        }
      }
    })
    .load()

test('sets the launcher text based on config', async () => {
  await buildWidget('feedback')
  expect(await launcher.getLabelText()).toEqual('Feedback')
})

test('also supports label key feedback', async () => {
  await buildWidget('support')
  expect(await launcher.getLabelText()).toEqual('Support')
})
