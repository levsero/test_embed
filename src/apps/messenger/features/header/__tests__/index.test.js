import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import Header from '../'
import createStore from 'src/apps/messenger/store'
import { companyReceived } from 'src/apps/messenger/store/company'

describe('Header', () => {
  const renderComponent = () => {
    const store = createStore()
    store.dispatch(
      companyReceived({
        name: 'Zendesk',
        avatar: 'https://www.zendesk.com/avatar.png',
        tagline: 'Elevate the conversation'
      })
    )

    return render(<Header />, { store })
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
