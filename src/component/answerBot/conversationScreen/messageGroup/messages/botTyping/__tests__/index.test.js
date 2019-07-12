import { render } from '@testing-library/react'
import React from 'react'

import BotTyping from '../index'

test('renders the expected classes', () => {
  const { container } = render(<BotTyping />)

  expect(container).toMatchSnapshot()
})
