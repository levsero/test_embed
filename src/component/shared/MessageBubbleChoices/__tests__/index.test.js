import { render } from 'react-testing-library'
import React from 'react'

import { MessageBubbleChoices } from '../index'

test('renders the expected classes', () => {
  const { container } = render(
    <MessageBubbleChoices
      leadingMessage="this is the leading message"
      leadingMessageStyle="gangnamStyle"
      containerStyle="containerStyle"
    >
      <div className="firstChild" />
      <div className="secondChild" />
      <div className="thirdChild" />
    </MessageBubbleChoices>
  )

  expect(container).toMatchSnapshot()
})

test('renders the expected classes when there is only one child', () => {
  const { container } = render(
    <MessageBubbleChoices
      leadingMessage="this is the leading message"
      leadingMessageStyle="gangnamStyle"
      containerStyle="containerStyle"
    >
      <div className="onlyChild" />
    </MessageBubbleChoices>
  )

  expect(container).toMatchSnapshot()
})

test('renders the expected classes when there is no leading message', () => {
  const { container } = render(
    <MessageBubbleChoices>
      <div className="firstChild" />
      <div className="secondChild" />
    </MessageBubbleChoices>
  )

  expect(container).toMatchSnapshot()
})
