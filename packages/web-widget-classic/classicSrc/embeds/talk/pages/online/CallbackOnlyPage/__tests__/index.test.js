import { handleTalkVendorLoaded, updateTalkCallbackForm } from 'classicSrc/embeds/talk/actions'
import getFormattedPhoneNumber from 'classicSrc/embeds/talk/utils/getFormattedPhoneNumber'
import createStore from 'classicSrc/redux/createStore'
import { render, dispatchUpdateEmbeddableConfig } from 'classicSrc/util/testHelpers'
import * as libphonenumber from 'libphonenumber-js'
import CallbackOnlyPage from '../index'

jest.mock('classicSrc/embeds/talk/utils/getFormattedPhoneNumber')

const mockFormattedNumber = '1800-738773'
beforeEach(() => {
  getFormattedPhoneNumber.mockReturnValue(mockFormattedNumber)
})

const renderComponent = (params = { country: 'AU' }) => {
  const store = createStore()

  store.dispatch(handleTalkVendorLoaded({ libphonenumber }))
  dispatchUpdateEmbeddableConfig(store, {
    phoneNumber: '+611800-738773',
  })
  store.dispatch(updateTalkCallbackForm({ country: params.country }))
  return render(<CallbackOnlyPage />, { store })
}

it('renders the header message and the form', () => {
  const { queryByText, queryByLabelText } = renderComponent()

  expect(queryByText("Enter your phone number and we'll call you back.")).toBeInTheDocument()
  expect(queryByLabelText(/Name/)).toBeInTheDocument()
  expect(queryByLabelText(/How can we help/)).toBeInTheDocument()
  expect(queryByLabelText(/Phone Number/)).toBeInTheDocument()
  expect(queryByText(/Send/)).toBeInTheDocument()
})

it('does not render the callback phone number', () => {
  const { queryByText } = renderComponent()
  expect(queryByText(mockFormattedNumber)).not.toBeInTheDocument()
})
