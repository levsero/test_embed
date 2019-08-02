import React from 'react'
import { render } from '@testing-library/react'
import { Component as ZendeskLogo } from '../index'

describe('ZendeskLogo', () => {
  it('renders logo if enabled', () => {
    const { container } = render(<ZendeskLogo href="yolo.com" />)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('does not render logo if disabled', () => {
    const { container } = render(<ZendeskLogo href="yolo.com" hideZendeskLogo={true} />)

    expect(container.firstChild).toMatchSnapshot()
  })
})
