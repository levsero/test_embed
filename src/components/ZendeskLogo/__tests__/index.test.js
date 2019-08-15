import React from 'react'
import { render } from '@testing-library/react'
import { Component as ZendeskLogo } from '../index'

it('renders logo', () => {
  const { container } = render(<ZendeskLogo href="yolo.com" />)

  expect(container.firstChild).toMatchSnapshot()
})
