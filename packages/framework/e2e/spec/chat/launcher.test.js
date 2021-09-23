import { waitForPrechatForm } from 'e2e/helpers/chat-embed'
import { waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import launcher from 'e2e/helpers/launcher'
import { waitForContactForm } from 'e2e/helpers/support-embed'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'
import { allowsInputTextEditing } from 'e2e/spec/shared-examples'
import { queries } from 'pptr-testing-library'
import { TEST_IDS } from 'src/constants/shared'

const buildWidget = async (...embeds) => {
  await loadWidget()
    .withPresets(...embeds)
    .dontWaitForLauncherToLoad()
    .load()
}

const itBehavesLikeADefaultLauncher = async () => {
  await launcher.expectLabelToEqual('Help')
  await launcher.expectIconToBeVisible('help')
}

describe('Regular Chat without chat badge settings', () => {
  beforeEach(async () => {
    await buildWidget('chat')
  })

  test('shows the Chat Pill launcher when agents are online', async () => {
    await zChat.online()
    await launcher.waitForLauncherPill()
    await launcher.expectLabelToEqual('Chat')
    await launcher.expectIconToBeVisible('chat')

    await launcher.click()
    await waitForPrechatForm()
  })

  test('does not show a launcher when agents are offline', async () => {
    await page.waitFor(2000)
    await expect(launcher).toBeHidden()
  })
})

describe('Chat standalone with chat badge settings', () => {
  beforeEach(async () => {
    await buildWidget('chatStandalone')
  })

  test('shows the Chat Badge when agents are online', async () => {
    await zChat.online()
    await launcher.waitForChatBadge()
  })

  test('does not show a launcher when agents are offline', async () => {
    await page.waitFor(2000)
    await expect(launcher).toBeHidden()
  })

  test('minimize shows the launcher', async () => {
    await zChat.online()
    await launcher.waitForTestId(TEST_IDS.ICON_DASH)
    const doc = await launcher.getDocument()
    const closeButton = await queries.getByTestId(doc, TEST_IDS.ICON_DASH)
    await closeButton.click()
    await expect(launcher).toBeVisible()
  })

  test('starting a chat from the chat badge and prechat form', async () => {
    await zChat.online()
    await launcher.waitForChatBadge()

    const element = await queries.queryByPlaceholderText(
      await launcher.getDocument(),
      'Type your message here'
    )

    await allowsInputTextEditing(element, 'Some message')
    await page.keyboard.press('Enter')

    const prechatFormMessage = await queries.queryByLabelText(
      await widget.getDocument(),
      'Message (optional)'
    )
    const prechatFormMessageValue = await prechatFormMessage.getProperty('value')
    await expect(await prechatFormMessageValue.jsonValue()).toBe('Some message')

    await widget.clickText('Start chat')

    await widget.expectToSeeText('Live Support')

    const composer = await queries.queryByPlaceholderText(
      await widget.getDocument(),
      'Type a message here...'
    )
    const composerValue = await composer.getProperty('value')
    await expect(await composerValue.jsonValue()).toBe('')

    await widget.expectToSeeText('Some message')
  })
})

describe('When Chat and Help Center are enabled', () => {
  beforeEach(async () => {
    await buildWidget('chat', 'helpCenter')
  })

  test('shows the Chat Pill launcher and Help icon when agents are online', async () => {
    await zChat.online()
    await launcher.waitForLauncherPill()
    await launcher.expectLabelToEqual('Help')
    await launcher.expectIconToBeVisible('chat')

    await launcher.click()
    await waitForHelpCenter()
  })

  test('shows the default launcher when agents are offline', async () => {
    await launcher.waitForLauncherPill()
    await itBehavesLikeADefaultLauncher()
  })
})

describe('When Chat and Support are enabled', () => {
  beforeEach(async () => {
    await buildWidget('chat', 'contactForm')
  })

  test('shows the Chat Pill launcher when agents are online', async () => {
    await zChat.online()
    await launcher.waitForLauncherPill()
    await launcher.expectLabelToEqual('Chat')
    await launcher.expectIconToBeVisible('chat')

    await launcher.click()
    await waitForPrechatForm()
  })

  test('shows the default launcher when agents are offline', async () => {
    await launcher.waitForLauncherPill()
    await itBehavesLikeADefaultLauncher()

    await launcher.click()
    await waitForContactForm()
  })
})

describe('When Chat with chat badge settings and Support are enabled', () => {
  beforeEach(async () => {
    await buildWidget('chatWithChatBadge', 'contactForm')
  })

  test('it ignores chat badge settings and shows chat pill launcher when agents are online', async () => {
    await zChat.online()
    await launcher.waitForLauncherPill()
    await launcher.expectLabelToEqual('Chat')
    await launcher.expectIconToBeVisible('chat')

    await launcher.click()
    await waitForPrechatForm()
  })

  test('shows the support launcher when agents are offline', async () => {
    await launcher.waitForLauncherPill()
    await itBehavesLikeADefaultLauncher()

    await launcher.click()
    await waitForContactForm()
  })
})

describe('When Support and Help Center are enabled', () => {
  beforeEach(async () => {
    await buildWidget('contactForm', 'helpCenter')
  })

  test('it behaves like a default launcher', async () => {
    await launcher.waitForLauncherPill()
    await itBehavesLikeADefaultLauncher()

    await launcher.click()
    await waitForHelpCenter()
  })
})
