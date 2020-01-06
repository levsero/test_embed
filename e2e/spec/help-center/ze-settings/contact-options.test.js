import { queries, wait } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import zChat from 'e2e/helpers/zChat'

const buildWidget = settings =>
  loadWidget()
    .withPresets('contactForm', 'chat', 'helpCenterWithContextualHelp')
    .intercept(mockSearchEndpoint())
    .evaluateOnNewDocument(contactOptions => {
      window.zESettings = {
        webWidget: {
          contactOptions
        }
      }
    }, settings)

const setupWidget = async settings => {
  await buildWidget(settings).load()
  await zChat.online()
  await launcher.click()
  await waitForHelpCenter()
}

const goToChannelChoice = async (text = 'Contact us') => {
  const doc = await widget.getDocument()
  const button = await queries.getByText(doc, text)
  await button.click()
}

test('forces contact options to show up when that setting is available', async () => {
  await setupWidget({ enabled: true })
  const doc = await widget.getDocument()
  const button = await queries.queryByText(doc, 'Contact us')
  expect(button).toBeTruthy()
  await button.click()
  const chat = await queries.queryByText(doc, 'Live chat')
  expect(chat).toBeTruthy()
  const contact = await queries.queryByText(doc, 'Leave a message')
  expect(contact).toBeTruthy()
})

test('clicking channel buttons will navigate to their respective embeds', async () => {
  await setupWidget({ enabled: true })
  const doc = await widget.getDocument()
  await goToChannelChoice()
  const chat = await queries.queryByText(doc, 'Live chat')
  await chat.click()
  expect(await queries.queryByText(doc, 'Chat with us')).toBeTruthy()
  await widget.clickBack()
  const contact = await queries.getByText(doc, 'Leave a message')
  await contact.click()
  const email = await queries.queryByLabelText(doc, 'Email address')
  expect(email).toBeTruthy()
})

test('contact us button text can be customized', async () => {
  await setupWidget({
    enabled: true,
    contactButton: {
      '*': 'Get in touch',
      fr: 'French get in touch'
    }
  })
  const doc = await widget.getDocument()
  expect(await queries.queryByText(doc, 'Get in touch')).toBeTruthy()
  await page.evaluate(() => zE('webWidget', 'setLocale', 'fr'))
  await wait(async () => {
    expect(await queries.queryByText(doc, 'French get in touch')).toBeTruthy()
  })
})

test('contact form button text can be customized', async () => {
  await setupWidget({
    enabled: true,
    contactFormLabel: {
      '*': 'Drop a line',
      fr: 'French drop a line'
    }
  })
  const doc = await widget.getDocument()
  await goToChannelChoice()
  expect(await queries.queryByText(doc, 'Drop a line')).toBeTruthy()
  await page.evaluate(() => zE('webWidget', 'setLocale', 'fr'))
  await wait(async () => {
    expect(await queries.queryByText(doc, 'French drop a line')).toBeTruthy()
  })
  const button = await queries.getByText(doc, 'French drop a line')
  await button.click()
  expect(await queries.queryByLabelText(doc, 'Adresse e-mail')).toBeTruthy()
})

test('chat online button text can be customized', async () => {
  await setupWidget({
    enabled: true,
    chatLabelOnline: {
      '*': 'Hit em up',
      fr: 'French hit em up'
    }
  })
  const doc = await widget.getDocument()
  await goToChannelChoice()
  expect(await queries.queryByText(doc, 'Hit em up')).toBeTruthy()
  await page.evaluate(() => zE('webWidget', 'setLocale', 'fr'))
  await wait(async () => {
    expect(await queries.queryByText(doc, 'French hit em up')).toBeTruthy()
  })
  const button = await queries.getByText(doc, 'French hit em up')
  await button.click()
  expect(await queries.queryByText(doc, 'Chattez avec nous')).toBeTruthy()
})
