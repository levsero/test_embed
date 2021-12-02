import { fireEvent } from '@testing-library/react'
import isFeatureEnabled from '@zendesk/widget-shared-services/feature-flags'
import { CLICK_TO_CALL } from 'src/embeds/talk/talk-capability-types'
import { render } from 'src/util/testHelpers'
import { Component as ChannelChoice } from '../index'

jest.mock('@zendesk/widget-shared-services/feature-flags')

const actions = Object.freeze({
  updateBackButtonVisibility: jest.fn(),
  updateActiveEmbed: jest.fn(),
})

const renderComponent = (props = {}) => {
  const defaultProps = {
    callbackAvailable: false,
    talkAvailable: false,
    submitTicketAvailable: false,
    chatAvailable: false,
    chatOfflineAvailable: false,
    chatOnlineAvailableLabel: 'Live chat',
    chatOfflineAvailableLabel: 'Live chat is offline',
    submitTicketLabel: 'Leave a message',
    actions,
  }

  const componentProps = {
    ...defaultProps,
    ...props,
  }

  return render(<ChannelChoice {...componentProps} />)
}

describe('leading message', () => {
  test('renders the default leading message', () => {
    const { queryByText } = renderComponent({
      callbackAvailable: true,
      talkAvailable: true,
      submitTicketAvailable: true,
      chatAvailable: true,
    })

    expect(queryByText('Choose a way to get in touch:')).toBeInTheDocument()
  })

  test('renders leading message if more than 1 channel is available and useLeadingMessageAsFallback is true', () => {
    const { queryByText } = renderComponent({
      callbackAvailable: true,
      talkAvailable: true,
      submitTicketAvailable: true,
      chatAvailable: true,
      leadingMessage: 'here here',
      useLeadingMessageAsFallback: true,
    })

    expect(queryByText('here here')).toBeInTheDocument()
  })

  test('renders the leading message when specified', () => {
    const { queryByText } = renderComponent({
      leadingMessage: 'hello world',
      submitTicketAvailable: true,
    })

    expect(queryByText('hello world')).toBeInTheDocument()
  })

  test('renders generic chat leading message when only chat is available', () => {
    const { queryByText } = renderComponent({
      chatAvailable: true,
    })

    expect(queryByText('Would you like to chat with someone who can help?')).toBeInTheDocument()
  })

  test('renders generic request callback leading message when only request callback is available', () => {
    const { queryByText } = renderComponent({
      talkAvailable: true,
      callbackAvailable: true,
    })

    expect(
      queryByText('Would you like the team to contact you regarding your question?')
    ).toBeInTheDocument()
  })

  test('renders generic call us leading message when only talk is available', () => {
    const { queryByText } = renderComponent({
      talkAvailable: true,
    })

    expect(queryByText('Would you like to contact us regarding your question?')).toBeInTheDocument()
  })

  test('renders generic call us leading message when only click to call is available', () => {
    const { queryByText } = renderComponent({
      talkAvailable: true,
      talkCapability: CLICK_TO_CALL,
    })

    expect(queryByText('Would you like to contact us regarding your question?')).toBeInTheDocument()
  })

  test('renders generic submit ticket leading message when only submit ticket is available', () => {
    const { queryByText } = renderComponent({
      submitTicketAvailable: true,
    })

    expect(
      queryByText('Would you like to leave a message so the team can follow up on your question?')
    ).toBeInTheDocument()
  })
})

describe('channels', () => {
  const assertNotRendered = (options, ...labels) => {
    const { queryByText } = renderComponent(options)

    labels.forEach((text) => {
      expect(queryByText(text)).not.toBeInTheDocument()
    })
  }

  const assertRendered = (options, label, icon) => {
    const { queryByText, queryByTestId } = renderComponent(options)

    expect(queryByText(label)).toBeInTheDocument()
    expect(queryByTestId(icon)).toBeInTheDocument()
  }

  describe('chat', () => {
    test('renders the chat channel when chat is available', () => {
      assertRendered({ chatAvailable: true }, 'Live chat', 'Icon--channelChoice-chat')
    })

    test('does not render other channels', () => {
      assertNotRendered({ chatAvailable: true }, 'Leave a message', 'Request a callback', 'Call us')
    })

    test('renders chat offline channel when chat offline is available', () => {
      assertRendered(
        { chatOfflineAvailable: true, chatAvailable: true },
        'Live chat is offline',
        'Icon--channelChoice-chat'
      )
    })
  })

  describe('submit ticket', () => {
    test('renders the submit ticket channel when submit ticket is available', () => {
      assertRendered(
        { submitTicketAvailable: true },
        'Leave a message',
        'Icon--channelChoice-contactForm'
      )
    })

    test('does not render other channels', () => {
      assertNotRendered(
        { submitTicketAvailable: true },
        'Live chat',
        'Request a callback',
        'Call us'
      )
    })
  })

  describe('talk', () => {
    test('renders the request a callback channel when talk and request a callback is available', () => {
      assertRendered(
        { talkAvailable: true, callbackAvailable: true },
        'Request a callback',
        'Icon--channelChoice-talk'
      )
    })

    test('does not render other channels', () => {
      assertNotRendered(
        { talkAvailable: true, callbackAvailable: true },
        'Leave a message',
        'Live chat',
        'Call us'
      )
    })

    test('renders call us channel when talk is available', () => {
      assertRendered({ talkAvailable: true }, 'Call us', 'Icon--channelChoice-talk')
    })

    test('renders click to call channel when talk and click to call capability is available', () => {
      isFeatureEnabled.mockReturnValue(true)
      assertRendered(
        { talkAvailable: true, talkCapability: CLICK_TO_CALL },
        'Call us',
        'Icon--channelChoice-clickToCall'
      )
    })
  })
})

describe('actions', () => {
  test('clicking on Leave a message', () => {
    const { getByText } = renderComponent({ submitTicketAvailable: true })

    fireEvent.click(getByText('Leave a message'))
    expect(actions.updateActiveEmbed).toHaveBeenCalledWith('ticketSubmissionForm')
    expect(actions.updateBackButtonVisibility).toHaveBeenCalledWith(true)
  })

  test('clicking on Live chat', () => {
    const { getByText } = renderComponent({ chatAvailable: true })

    fireEvent.click(getByText('Live chat'))
    expect(actions.updateActiveEmbed).toHaveBeenCalledWith('chat')
    expect(actions.updateBackButtonVisibility).toHaveBeenCalledWith(true)
  })

  test('clicking on Live chat is offline', () => {
    const { getByText } = renderComponent({ chatOfflineAvailable: true })

    fireEvent.click(getByText('Live chat is offline'))
    expect(actions.updateActiveEmbed).toHaveBeenCalledWith('chat')
    expect(actions.updateBackButtonVisibility).toHaveBeenCalledWith(true)
  })

  test('clicking on Request a callback', () => {
    const { getByText } = renderComponent({
      callbackAvailable: true,
      talkAvailable: true,
    })

    fireEvent.click(getByText('Request a callback'))
    expect(actions.updateActiveEmbed).toHaveBeenCalledWith('talk')
    expect(actions.updateBackButtonVisibility).toHaveBeenCalledWith(true)
  })
})
