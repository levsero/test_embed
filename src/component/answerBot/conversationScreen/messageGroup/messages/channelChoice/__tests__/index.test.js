import 'utility/i18nTestHelper';
import { render, fireEvent } from 'react-testing-library';
import React from 'react';

import { PureChannelChoice as ChannelChoice } from '../index';

const actions = Object.freeze({
  updateBackButtonVisibility: jest.fn(),
  updateActiveEmbed: jest.fn()
});

const renderComponent = (props = {}) => {
  const defaultProps = {
    callbackAvailable: false,
    talkAvailable: false,
    submitTicketAvailable: false,
    chatAvailable: false,
    actions
  };

  const componentProps = {
    ...defaultProps,
    ...props
  };

  return render(<ChannelChoice {...componentProps} />);
};

test('renders the expected classes', () => {
  const { container } = renderComponent({
    callbackAvailable: true,
    talkAvailable: true,
    submitTicketAvailable: true,
    chatAvailable: true
  });

  expect(container)
    .toMatchSnapshot();
});

test('renders the leading message', () => {
  const { container } = renderComponent({
    leadingMessage: 'hello world',
    callbackAvailable: true,
    talkAvailable: true,
    submitTicketAvailable: true,
    chatAvailable: true
  });

  expect(container)
    .toMatchSnapshot();
});

describe('channels', () => {
  const assertExpected = (props) => {
    const { container } = renderComponent(props);

    expect(container)
      .toMatchSnapshot();
  };

  it('renders the passed in leading message regardless of other properties', () => {
    assertExpected({
      submitTicketAvailable: true,
      leadingMessage: 'blah blah'
    });
  });

  it('renders expected leading message if only submit ticket is available', () => {
    assertExpected({ submitTicketAvailable: true, leadingMessage: 'blah' });
  });

  it('renders expected leading message if only chat is available', () => {
    assertExpected({ chatAvailable: true, leadingMessage: 'blah' });
  });

  it('renders expected leading message if only request callback is available', () => {
    assertExpected({ callbackAvailable: true, leadingMessage: 'blah' });
  });

  it('renders expected leading message if only call us is available', () => {
    assertExpected({ talkAvailable: true, leadingMessage: 'blah' });
  });

  it('renders request callback leading message if request callback and call us are available', () => {
    assertExpected({ callbackAvailable: true, talkAvailable: true, leadingMessage: 'blah' });
  });

  it('renders generic leading message if more than 1 channel is available', () => {
    assertExpected({ chatAvailable: true, talkAvailable: true });
  });

  it('does not render chat if chat is available', () => {
    assertExpected({ submitTicketAvailable: true, oldChat: true });
  });

  it('renders leading message if more than 1 channel is available and useLeadingMessageAsFallback is true', () => {
    assertExpected({
      chatAvailable: true,
      talkAvailable: true,
      leadingMessage: 'hi',
      useLeadingMessageAsFallback: true
    });
  });
});

describe('actions', () => {
  test('clicking on Leave a message', () => {
    const { getByText } = renderComponent({ submitTicketAvailable: true });

    fireEvent.click(getByText('Leave a message'));
    expect(actions.updateActiveEmbed)
      .toHaveBeenCalledWith('ticketSubmissionForm');
    expect(actions.updateBackButtonVisibility)
      .toHaveBeenCalledWith(true);
  });

  test('clicking on Live chat', () => {
    const { getByText } = renderComponent({ chatAvailable: true });

    fireEvent.click(getByText('Live chat'));
    expect(actions.updateActiveEmbed)
      .toHaveBeenCalledWith('chat');
    expect(actions.updateBackButtonVisibility)
      .toHaveBeenCalledWith(true);
  });

  test('clicking on Live chat (old chat)', () => {
    const { getByText } = renderComponent({ oldChat: true, chatAvailable: true });

    fireEvent.click(getByText('Live chat'));
    expect(actions.updateActiveEmbed)
      .toHaveBeenCalledWith('zopimChat');
    expect(actions.updateBackButtonVisibility)
      .toHaveBeenCalledWith(true);
  });

  test('clicking on Request a callback', () => {
    const { getByText } = renderComponent({ callbackAvailable: true, talkAvailable: true });

    fireEvent.click(getByText('Request a callback'));
    expect(actions.updateActiveEmbed)
      .toHaveBeenCalledWith('talk');
    expect(actions.updateBackButtonVisibility)
      .toHaveBeenCalledWith(true);
  });
});
