import React from 'react'
import { render } from 'src/embeddables/messenger/utils/testHelpers'
import App from '../'

describe('Messenger app', () => {
  const renderComponent = () => render(<App />)

  it('renders the launcher', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('TODO: Launcher')).toBeInTheDocument()
  })

  it('renders the messenger', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('TODO: Messenger')).toBeInTheDocument()
  })
})
