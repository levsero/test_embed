import { queries } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import { waitForPrechatForm } from 'e2e/helpers/chat-embed'
import { waitForContactForm } from 'e2e/helpers/support-embed'
import { waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import { TEST_IDS } from 'src/constants/shared'
import zChat from 'e2e/helpers/zChat'

const buildWidget = async (...embeds) => {
  await loadWidget()
    .withPresets(...embeds)
    .hiddenInitially()
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
