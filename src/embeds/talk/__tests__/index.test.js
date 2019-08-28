jest.mock('src/embeds/talk/pages/CallbackPage', () => () => (
  <div data-testid="talk--callbackPage" />
))
jest.mock('src/embeds/talk/pages/PhoneOnlyPage', () => () => <div data-testid="talk--phonePage" />)
jest.mock('src/embeds/talk/pages/SuccessNotificationPage', () => () => (
  <div data-testid="talk--successPage" />
))
jest.mock('src/embeds/talk/pages/OfflinePage', () => () => <div data-testid="talk--offlinePage" />)

import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'
import { CONTACT_OPTIONS } from '../constants'
import { Component as Talk } from '../'

describe('Talk', () => {
  const defaultProps = {
    agentAvailability: true,
    contactOption: CONTACT_OPTIONS.CALLBACK_ONLY
  }
  const store = createStore()

  const renderComponent = (props = {}, route = '') => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Talk {...defaultProps} {...props} />
        </MemoryRouter>
      </Provider>
    )
  }

  it('renders the offline page when no agents online', () => {
    const { queryByTestId } = renderComponent({ agentAvailability: false })

    expect(queryByTestId('talk--offlinePage')).toBeInTheDocument()
  })

  it('renders the success page when route is /talk/success', () => {
    const { queryByTestId } = renderComponent(undefined, '/talk/success')

    expect(queryByTestId('talk--successPage')).toBeInTheDocument()
  })

  const contactOptionTestCases = [
    ['callback', CONTACT_OPTIONS.CALLBACK_ONLY, 'talk--callbackPage'],
    ['callback', CONTACT_OPTIONS.CALLBACK_AND_PHONE, 'talk--callbackPage'],
    ['phone', CONTACT_OPTIONS.PHONE_ONLY, 'talk--phonePage']
  ]
  contactOptionTestCases.forEach(([page, contactOption, expectedTestId]) => {
    it(`renders the ${page} page when contact option is ${contactOption}`, () => {
      const { queryByTestId } = renderComponent({ contactOption })

      expect(queryByTestId(expectedTestId)).toBeInTheDocument()
    })
  })
})
