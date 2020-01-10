import { render } from '@testing-library/react'
import React from 'react'

import PillButton from '../index'

test('renders the expected classes', () => {
  const { container } = render(<PillButton label="hello world" />)

  expect(container).toMatchSnapshot()
})

test('allows custom classes', () => {
  const { container } = render(<PillButton label="custom class" className="blah" />)

  expect(container).toMatchSnapshot()
})
