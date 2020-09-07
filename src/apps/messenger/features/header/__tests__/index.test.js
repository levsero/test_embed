import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import Header from '../'
import createStore from 'src/apps/messenger/store'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import ThemeProvider from 'src/apps/messenger/features/themeProvider'

describe('Header', () => {
  const renderComponent = () => {
    const store = createStore()
    store.dispatch(
      messengerConfigReceived({ title: 'Zendesk', description: 'Elevate the conversation' })
    )

    return render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
      { store }
    )
  }

  it('renders company title', () => {
    const { getByText } = renderComponent()

    expect(getByText('Zendesk')).toBeInTheDocument()
  })

  it('renders company tagline', () => {
    const { getByText } = renderComponent()

    expect(getByText('Elevate the conversation')).toBeInTheDocument()
  })

  it('renders the company avatar', () => {
    const { getByAltText } = renderComponent()
    expect(getByAltText('company avatar')).toBeInTheDocument()
  })
})
