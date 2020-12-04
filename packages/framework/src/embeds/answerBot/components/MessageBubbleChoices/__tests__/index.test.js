import { render } from '@testing-library/react'
import React from 'react'

import MessageBubbleChoices from '../index'

test('renders the leading message', () => {
  const { queryByText } = render(
    <MessageBubbleChoices leadingMessage="this is the leading message">
      <div className="firstChild" />
      <div className="secondChild" />
      <div className="thirdChild" />
    </MessageBubbleChoices>
  )

  expect(queryByText('this is the leading message')).toBeInTheDocument()
})
