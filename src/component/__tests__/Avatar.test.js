import { render } from '@testing-library/react'
import React from 'react'

import { Avatar } from '../Avatar'

test('renders an img when src is provided ', () => {
  const { container } = render(<Avatar src="http://sauce" fallbackIcon="fallback" />)

  expect(container).toMatchSnapshot()
})

test('renders a button', () => {
  const { container } = render(<Avatar fallbackIcon="Icon--avatar" />)

  expect(container).toMatchSnapshot()
})
