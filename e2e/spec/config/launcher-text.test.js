import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'

test('sets the launcher text based on config', async () => {
  await loadWidget()
    .withPresets('helpCenter', {
      embeds: {
        launcher: {
          props: {
            labelKey: 'feedback'
          }
        }
      }
    })
    .load()
  expect(await launcher.getLabelText()).toEqual('Feedback')
})
