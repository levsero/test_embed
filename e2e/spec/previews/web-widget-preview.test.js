import preview, { loadPreview } from 'e2e/helpers/web-widget-preview'
import { queries } from 'pptr-testing-library'

test('renders preview', async () => {
  await loadPreview()
  const doc = await preview.getDocument()
  expect(await queries.queryByText(doc, 'Leave us a message')).toBeTruthy()
  expect(await queries.queryByLabelText(doc, 'Your name (optional)')).toBeTruthy()
  expect(await queries.queryByLabelText(doc, 'Email address')).toBeTruthy()
  expect(await queries.queryByLabelText(doc, 'How can we help you?')).toBeTruthy()
})

test('setTitle sets the preview title', async () => {
  await loadPreview()
  await page.evaluate(() => {
    window.preview.setTitle('contact')
  })
  const doc = await preview.getDocument()
  expect(await queries.queryByText(doc, 'Leave us a message')).toBeNull()
  expect(await queries.queryByText(doc, 'Contact us')).toBeTruthy()
  await page.evaluate(() => {
    window.preview.setTitle('message')
  })
  expect(await queries.queryByText(doc, 'Contact us')).toBeNull()
  expect(await queries.queryByText(doc, 'Leave us a message')).toBeTruthy()
})

test('setColor sets the preview color', async () => {
  await loadPreview()
  await page.evaluate(() => {
    window.preview.setColor('#000FFF')
  })

  const headerColor = await preview.evaluate(
    () => getComputedStyle(document.querySelector('h1').parentElement.parentElement).backgroundColor
  )
  expect(headerColor).toEqual('rgb(0, 15, 255)')
})
