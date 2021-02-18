import { render } from '@testing-library/react'
import React from 'react'

import { ButtonNav } from '../ButtonNav'

const renderComponent = (props) => {
  const label = <span>this is a label</span>

  return render(<ButtonNav aria-label="blah" label={label} isMobile={false} {...props} />)
}

test('renders the expected classes', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

test('renders the expected mobile classes', () => {
  const { container } = renderComponent({ fullscreen: true })

  expect(container).toMatchSnapshot()
})

test('renders the expected left classes', () => {
  const { container } = renderComponent({ position: 'left' })

  expect(container).toMatchSnapshot()
})

test('renders the expected right classes', () => {
  const { container } = renderComponent({ position: 'right' })

  expect(container).toMatchSnapshot()
})
