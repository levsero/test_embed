import * as libphonenumber from 'libphonenumber-js'
import getFormattedPhoneNumber from 'src/embeds/talk/utils/getFormattedPhoneNumber'
import createStore from 'src/redux/createStore'
import { handleTalkVendorLoaded, updateTalkCallbackForm } from 'src/redux/modules/talk'
import { render, dispatchUpdateEmbeddableConfig } from 'src/util/testHelpers'
import CallbackOnlyPage from '../index'

jest.mock('src/embeds/talk/utils/getFormattedPhoneNumber')

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
