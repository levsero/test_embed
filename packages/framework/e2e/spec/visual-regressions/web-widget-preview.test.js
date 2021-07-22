/**
 * @group visual-regressions
 */
import { assertScreenshot } from 'e2e/helpers/visual-regressions'
import preview, { loadPreview } from 'e2e/helpers/web-widget-preview'
import { queries, wait } from 'pptr-testing-library'

test('web widget preview', async () => {
  await loadPreview()
  const doc = await preview.getDocument()
  await wait(() => queries.getByText(doc, 'Leave us a message'))
  await assertScreenshot('web-widget-preview')
})
