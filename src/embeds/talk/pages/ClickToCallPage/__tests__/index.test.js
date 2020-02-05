import React from 'react'

import { render } from 'utility/testHelpers'
import { Component as ClickToCallPage } from '..'

jest.mock('src/redux/modules/talk/talk-selectors')
jest.mock('src/embeds/talk/hooks/useSnapcallUpdateTime', () => () => '00:00')

const defaultProps = {
  callStatus: null
}

const renderComponent = props => render(<ClickToCallPage {...defaultProps} {...props} />)

describe('render', () => {
  it('renders the expected title', () => {
    const { getByText } = renderComponent()

    expect(getByText('Call Us')).toBeInTheDocument()
  })
})
