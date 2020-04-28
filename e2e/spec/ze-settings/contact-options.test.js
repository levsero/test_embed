import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'
import { search, waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import { mockSearchEndpoint } from 'e2e/helpers/help-center-embed'

const setup = async (extraProducts = []) => {
  await loadWidget()
    .withPresets(...extraProducts, 'chat', 'contactForm')
    .intercept(mockSearchEndpoint())
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          contactOptions: {
            enabled: true
          }
        }
      }
    })
    .load()

  await zChat.online()
  await launcher.click()
}

const testChatAndSubmitTicketInChannelChoicePage = () => {
  const expectChannelChoicePage = async () => {
    await widget.expectToSeeText('Live chat')
    await widget.expectToSeeText('Leave a message')
  }

  test('show the correct contact options', async () => {
    await expectChannelChoicePage()
  })

  test('access chat product and go back', async () => {
    await widget.clickButton('Live chat')

    await widget.expectToSeeText('Chat with us')
    await widget.expectToSeeText('Start chat')

    await widget.clickBack()
    await expectChannelChoicePage()
  })

  test('access contact form product and go back', async () => {
    await widget.clickButton('Leave a message')

    await widget.expectToSeeText('Leave us a message')
    await widget.expectToSeeText('How can we help you?')
    await widget.expectToSeeText('Add up to 5 files')
    await widget.expectToSeeText('Send')

    await widget.clickBack()
    await expectChannelChoicePage()
  })
}

describe('when help center, online chat and submit ticket are enabled', () => {
  beforeEach(async () => {
    await setup(['helpCenter'])
    await waitForHelpCenter()
    await search('Help')
    await widget.waitForText('Contact us')
    await widget.clickButton('Contact us')
  })

  testChatAndSubmitTicketInChannelChoicePage()
})

describe('when online chat and submit ticket are enabled', () => {
  beforeEach(async () => {
    await setup()
  })

  testChatAndSubmitTicketInChannelChoicePage()
})
