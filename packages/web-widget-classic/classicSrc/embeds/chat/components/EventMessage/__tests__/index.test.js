import { TEST_IDS } from 'classicSrc/constants/shared'
import { render } from 'classicSrc/util/testHelpers'
import { Component as EventMessage } from '../'

const renderComponent = (customProps = {}) => {
  const defaultProps = {
    children: {},
    chatLogCreatedAt: 1588227858632,
  }

  const props = {
    ...defaultProps,
    ...customProps,
  }

  return render(
    <EventMessage {...props}>
      <button>Request Rating button </button>
    </EventMessage>
  )
}

describe('EventMessage', () => {
  it("renders 'Chat started' when visitor starts chat", () => {
    const { getByTestId, getByText } = renderComponent({
      key: 123456,
      eventKey: 123456,
      event: {
        timestamp: 1588227858632,
        nick: 'visitor',
        type: 'chat.memberjoin',
        display_name: 'Visitor 21173003',
      },
    })

    expect(getByTestId(TEST_IDS.CHAT_MSG_EVENT)).toBeInTheDocument()
    expect(getByText('Chat started')).toBeInTheDocument()
  })

  it("renders 'agent joined the chat' when agent joins chat", () => {
    const { getByTestId, getByText } = renderComponent({
      key: 123456,
      eventKey: 123456,
      event: {
        timestamp: 1588240662239,
        nick: 'agent:45031391',
        type: 'chat.memberjoin',
        display_name: 'agent',
      },
    })

    expect(getByTestId(TEST_IDS.CHAT_MSG_EVENT)).toBeInTheDocument()
    expect(getByText('agent joined the chat')).toBeInTheDocument()
  })

  it("renders 'agent left the chat' when agent closes the chat", () => {
    const { getByTestId, getByText } = renderComponent({
      key: 123456,
      eventKey: 123456,
      event: {
        timestamp: 1588242423302,
        nick: 'agent:45031391',
        type: 'chat.memberleave',
        reason: 'user_leave_chat',
        display_name: 'agent',
      },
    })

    expect(getByTestId(TEST_IDS.CHAT_MSG_EVENT)).toBeInTheDocument()
    expect(getByText('agent left the chat')).toBeInTheDocument()
  })

  it("renders 'agent was disconnected and has left the chat' when agent is disconnected from the chat", () => {
    const { getByTestId, getByText } = renderComponent({
      key: 123456,
      eventKey: 123456,
      event: {
        timestamp: 1588242423302,
        nick: 'agent:45031391',
        type: 'chat.memberleave',
        reason: 'disconnect_user',
        display_name: 'agent',
      },
    })

    expect(getByTestId(TEST_IDS.CHAT_MSG_EVENT)).toBeInTheDocument()
    expect(getByText('agent was disconnected and has left the chat')).toBeInTheDocument()
  })

  it("renders 'Chat ended' when visitor ends the chat", () => {
    const { getByTestId, getByText } = renderComponent({
      key: 123456,
      eventKey: 123456,
      event: {
        timestamp: 1588227858632,
        nick: 'visitor',
        type: 'chat.memberleave',
        reason: 'user_leave_chat',
        display_name: 'Visitor 21173003',
      },
    })

    expect(getByTestId(TEST_IDS.CHAT_MSG_EVENT)).toBeInTheDocument()
    expect(getByText('Chat ended')).toBeInTheDocument()
  })

  it("renders 'Chat rated Good' when visitor gives a good rating", () => {
    const { getByTestId, getByText } = renderComponent({
      key: 123456,
      eventKey: 123456,
      event: {
        timestamp: 1588244444988,
        nick: 'visitor',
        type: 'chat.rating',
        display_name: 'Visitor 21173003',
        new_rating: 'good',
      },
    })

    expect(getByTestId(TEST_IDS.CHAT_MSG_EVENT)).toBeInTheDocument()
    expect(getByText('Chat rated Good')).toBeInTheDocument()
  })

  it("renders 'Chat rated Bad' when visitor gives a bad rating", () => {
    const { getByTestId, getByText } = renderComponent({
      key: 123456,
      eventKey: 123456,
      event: {
        timestamp: 1588244444988,
        nick: 'visitor',
        type: 'chat.rating',
        display_name: 'Visitor 21173003',
        new_rating: 'bad',
      },
    })

    expect(getByTestId(TEST_IDS.CHAT_MSG_EVENT)).toBeInTheDocument()
    expect(getByText('Chat rated Bad')).toBeInTheDocument()
  })

  it("renders 'Chat rating removed' when visitor removes a rating", () => {
    const { getByTestId, getByText } = renderComponent({
      key: 123456,
      eventKey: 123456,
      event: {
        timestamp: 1588244444988,
        nick: 'visitor',
        type: 'chat.rating',
        new_rating: undefined,
        display_name: 'Visitor 21173003',
        rating: 'good',
      },
    })

    expect(getByTestId(TEST_IDS.CHAT_MSG_EVENT)).toBeInTheDocument()
    expect(getByText('Chat rating removed')).toBeInTheDocument()
  })

  it("renders 'Comment submitted' when visitor submits a comment", () => {
    const { getByTestId, getByText } = renderComponent({
      key: 123456,
      eventKey: 123456,
      event: {
        timestamp: 1588244444988,
        nick: 'visitor',
        type: 'chat.comment',
        display_name: 'Visitor 21173003',
      },
    })

    expect(getByTestId(TEST_IDS.CHAT_MSG_EVENT)).toBeInTheDocument()
    expect(getByText('Comment submitted')).toBeInTheDocument()
  })

  it("renders 'Contact details updated' when visitor updates contact info", () => {
    const { getByTestId, getByText } = renderComponent({
      key: 123456,
      eventKey: 123456,
      event: {
        timestamp: 1588244444988,
        nick: 'visitor',
        type: 'chat.contact_details.updated',
        display_name: 'Visitor 21173003',
      },
    })

    expect(getByTestId(TEST_IDS.CHAT_MSG_EVENT)).toBeInTheDocument()
    expect(getByText('Contact details updated')).toBeInTheDocument()
  })
})
