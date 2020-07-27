import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import { Component } from '../'

describe('Messenger app', () => {
  const renderComponent = props => {
    const combinedProps = {
      showMessenger: false,
      ...props
    }

    return render(<Component {...combinedProps} />)
  }

  it('renders the launcher', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('TODO: Launcher')).toBeInTheDocument()
  })

  it('does not render the messenger when not open', () => {
    const { queryByTitle } = renderComponent()

    expect(queryByTitle('TODO: Messenger')).not.toBeInTheDocument()
  })

  it('renders the messenger when open', () => {
    const { getByTitle } = renderComponent({ showMessenger: true })

    expect(getByTitle('TODO: Messenger')).toBeInTheDocument()
  })
})
