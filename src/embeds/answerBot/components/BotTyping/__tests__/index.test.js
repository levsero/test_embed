import { render } from 'src/util/testHelpers'
import React from 'react'

import BotTyping from '../index'

test('renders the expected classes', () => {
  const { container } = render(<BotTyping />)

  expect(container).toMatchSnapshot()
})
