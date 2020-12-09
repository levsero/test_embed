import React from 'react'

import { render } from 'utility/testHelpers'
import { Component as ClickToCallPage } from '..'

jest.mock('src/redux/modules/talk/talk-selectors')
jest.mock('src/embeds/talk/hooks/useSnapcallUpdateTime', () => () => '00:00')

const defaultProps = {
  callDuration: '0:00'
}

const renderComponent = props => render(<ClickToCallPage {...defaultProps} {...props} />)

describe('render', () => {
  it('renders the expected title', () => {
    const { getByText } = renderComponent()

    expect(getByText('Call Us')).toBeInTheDocument()
  })

  it('renders the start call button if the call is not active', () => {
    const { getByText } = renderComponent({ callStatus: 'inactive' })

    expect(getByText('Start call')).toBeInTheDocument()
  })

  it('does not render the start call button if the call is active', () => {
    const { queryByText } = renderComponent({ callStatus: 'active' })

    expect(queryByText('Start call')).not.toBeInTheDocument()
  })

  it('renders the end call button if the call is active', () => {
    const { getByText } = renderComponent({ callStatus: 'active' })

    expect(getByText('Hang up')).toBeInTheDocument()
  })

  it('does not render the end call button if the call is not active', () => {
    const { queryByText } = renderComponent({ callStatus: 'inactive' })

    expect(queryByText('Hang up')).not.toBeInTheDocument()
  })
})
