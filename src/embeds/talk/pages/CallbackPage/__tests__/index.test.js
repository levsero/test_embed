import React from 'react'
import * as libphonenumber from 'libphonenumber-js'

import CallbackPage from '../index'
import createStore from 'src/redux/createStore'
import { handleTalkVendorLoaded, updateTalkCallbackForm } from 'src/redux/modules/talk'
import { render } from 'src/util/testHelpers'
import getFormattedPhoneNumber from 'src/embeds/talk/utils/getFormattedPhoneNumber'

jest.mock('src/embeds/talk/utils/getFormattedPhoneNumber')

beforeEach(() => {
  getFormattedPhoneNumber.mockReturnValue('1800-7383773')
})

const renderComponent = (params = { country: 'AU' }) => {
  const store = createStore()

  store.dispatch(handleTalkVendorLoaded({ libphonenumber }))
  store.dispatch(updateTalkCallbackForm({ country: params.country }))
  return render(<CallbackPage />, { store })
}

it('renders the header message and the form', () => {
  const { queryByText, queryByLabelText } = renderComponent()

  expect(queryByText("Enter your phone number and we'll call you back.")).toBeInTheDocument()
  expect(queryByLabelText(/Name/)).toBeInTheDocument()
  expect(queryByLabelText(/How can we help/)).toBeInTheDocument()
  expect(queryByLabelText(/Phone Number/)).toBeInTheDocument()
  expect(queryByText(/Send/)).toBeInTheDocument()
})
