import React from 'react'

import { render } from 'utility/testHelpers'
import AgentInfo from '..'

const agent = {
  nick: 'agent:1',
  isTyping: false,
  title: 'kill_neo_666@hotmail.com',
  display_name: 'Agent Smith',
}

const renderComponent = (alternateProps) => {
  const props = { ...agent, ...alternateProps }

  return render(<AgentInfo agent={props} />)
}

test('it renders', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

describe('when there is an avatar path', () => {
  it('renders the image provided', () => {
    const { container } = renderComponent({ avatar_path: 'http://img.com/coolpic.jpg' })
    const avatar = container.querySelector('img')

    expect(avatar.src).toEqual('http://img.com/coolpic.jpg')
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })
})

describe('when there is no avatar path', () => {
  it('falls back to a default svg', () => {
    const { container } = renderComponent()

    expect(
      container.querySelector('svg[realfilename="widget-icon_avatar.svg"]')
    ).toBeInTheDocument()
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})
