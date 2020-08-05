import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import App from '../'

describe('Messenger app', () => {
  const renderComponent = ({ isMessengerOpen = false }) => {
    const state = {
      core: { isMessengerOpen }
    }
    return render(<App />, { state })
  }

  it('renders the launcher', () => {
    const { getByTitle } = renderComponent({})

    expect(getByTitle('TODO: Launcher')).toBeInTheDocument()
  })

  it('does not render the messenger when not messenger is open', () => {
    const { queryByTitle } = renderComponent({})

    expect(queryByTitle('TODO: Messenger')).not.toBeInTheDocument()
  })

  it('renders the messenger when messenger is open', () => {
    const { getByTitle } = renderComponent({ isMessengerOpen: true })

    expect(getByTitle('TODO: Messenger')).toBeInTheDocument()
  })
})
