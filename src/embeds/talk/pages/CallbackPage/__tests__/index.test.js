import React from 'react'
import { render } from '@testing-library/react'
import CallbackPage from '../index'
import createStore from 'src/redux/createStore'
import { Provider } from 'react-redux'
import { handleTalkVendorLoaded, updateTalkCallbackForm } from 'src/redux/modules/talk'
import * as libphonenumber from 'libphonenumber-js'

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
