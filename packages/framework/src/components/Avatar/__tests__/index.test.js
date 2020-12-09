import React from 'react'

import { render } from 'utility/testHelpers'
import Avatar from '..'

const renderComponent = props => render(<Avatar {...props} />)

describe('when an image src is provided', () => {
  it('renders an img element with the passed src', () => {
    const { container } = renderComponent({ src: 'http://img.com/avatar.png' })
    const avatar = container.querySelector('img')

    expect(avatar.src).toEqual('http://img.com/avatar.png')
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })
})

describe('when no image src is provided', () => {
  it('falls back to ICONS.AGENT_AVATAR svg', () => {
    const { container } = renderComponent()

    expect(
      container.querySelector('svg[realfilename="widget-icon_avatar.svg"]')
    ).toBeInTheDocument()
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})
