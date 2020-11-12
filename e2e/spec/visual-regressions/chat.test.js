/**
 * @group visual-regressions
 */
import { queries } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'
import zChat from 'e2e/helpers/zChat'
import {
  waitForChatToBeReady,
  clickStartChat,
  agentJoinsChat,
  loadWidgetWithChatOnline,
  clickChatOptions
} from 'e2e/helpers/chat-embed'
import { allowsInputTextEditing } from '../shared-examples'
import { clearInputField } from 'e2e/helpers/utils'
import { assertScreenshot } from 'e2e/helpers/visual-regressions'

const sendMessageFromAgent = async proactive => {
  const detail = {
    nick: 'agent:12345',
    msg: 'message from agent',
    display_name: 'An agent',
    proactive
  }
  await zChat.chat(detail)
}
const buildWidget = () =>
  loadWidget()
    .withPresets('chat')
    .hiddenInitially()

test('proactive chats show a notification on mobile', async () => {
  await buildWidget()
    .useMobile()
    .load()
  await zChat.online()
  await launcher.waitForLauncherPill()
  await agentJoinsChat('An agent')

  await sendMessageFromAgent(true)

  await widget.waitForText('message from agent')
  await assertScreenshot('proactive-notification', { wait: 500 })
})

test('proactive chat', async () => {
  await loadWidget()
    .withPresets('chatStandalone')
    .hiddenInitially()
    .load()
  await zChat.online()
  await launcher.waitForChatBadge()
  await assertScreenshot('chat-badge')
})

const populateField = async (fieldLabel, value) => {
  const element = await queries.queryByLabelText(await widget.getDocument(), fieldLabel)

  await clearInputField(element)
  await allowsInputTextEditing(element, value)
}

const loadPrechatForm = async (options = {}) => {
  await loadWidgetWithChatOnline(options)
  await zChat.setVisitorInfo()
  await page.waitFor(500)
  await populateField('Name (optional)', 'Some name')
  await populateField('Email (optional)', 'example@example.com')
  await populateField('Message (optional)', 'Some message')
}

const loadOptions = async (options = {}) => {
  await loadPrechatForm(options)
  await clickStartChat()
  await waitForChatToBeReady()
  await clickChatOptions()
}

const chatOnline = async tag => {
  await assertScreenshot('prechat-form', { tag })
  await clickStartChat()
  await waitForChatToBeReady()
  await assertScreenshot('chat-log', { tag })
}

const chatOptions = async tag => {
  await widget.waitForText('Edit contact details')
  await assertScreenshot('chat-options', { tag })
}

const editContactDetails = async tag => {
  await widget.waitForText('Edit contact details')
  await widget.clickText('Edit contact details')
  await widget.waitForText('Cancel')
  await assertScreenshot('chat-contact-details', { tag })
}

const emailTranscript = async tag => {
  await widget.waitForText('Email transcript')
  await widget.clickText('Email transcript')
  await widget.waitForText('Cancel')
  await assertScreenshot('chat-email-transcript', { tag })
}

describe('desktop', () => {
  test('chat online', async () => {
    await loadPrechatForm()
    await chatOnline()
  })

  describe('menu options', () => {
    beforeEach(async () => loadOptions())

    test('options', async () => {
      await chatOptions()
    })

    test('contact details', async () => {
      await editContactDetails()
    })

    test('email transcript', async () => {
      await emailTranscript()
    })
  })
})

describe('mobile', () => {
  test('chat online', async () => {
    await loadPrechatForm({ mobile: true })
    await chatOnline('mobile')
  })

  describe('menu options', () => {
    beforeEach(async () => loadOptions({ mobile: true }))

    test('options', async () => {
      await chatOptions('mobile')
    })

    test('contact details', async () => {
      await editContactDetails('mobile')
    })

    test('email transcript', async () => {
      await emailTranscript('mobile')
    })
  })
})
