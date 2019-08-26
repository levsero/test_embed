import React from 'react'
import { Provider } from 'react-redux'
import * as libphonenumber from 'libphonenumber-js'
import { render } from '@testing-library/react'

import CallbackPage from '../index'
import createStore from 'src/redux/createStore'
import { handleTalkVendorLoaded, updateTalkCallbackForm } from 'src/redux/modules/talk'

import * as talkSelectors from 'src/embeds/talk/selectors/reselectors'

beforeEach(() => {
  jest.spyOn(talkSelectors, 'getFormattedPhoneNumber').mockImplementation(() => '1800-7383773')
})

afterEach(() => {
  talkSelectors.getFormattedPhoneNumber.mockRestore()
})

const renderComponent = (params = { country: 'AU' }) => {
  const store = createStore()

  store.dispatch(handleTalkVendorLoaded({ libphonenumber }))
  store.dispatch(updateTalkCallbackForm({ country: params.country }))
  return render(
    <Provider store={store}>
      <CallbackPage />
    </Provider>
  )
}

it('renders the header message and the form', () => {
  const { queryByText, queryByLabelText } = renderComponent()

  expect(queryByText("Enter your phone number and we'll call you back.")).toBeInTheDocument()
  expect(queryByLabelText(/Name/)).toBeInTheDocument()
  expect(queryByLabelText(/How can we help/)).toBeInTheDocument()
  expect(queryByLabelText(/Phone Number/)).toBeInTheDocument()
  expect(queryByText(/Send/)).toBeInTheDocument()
})
