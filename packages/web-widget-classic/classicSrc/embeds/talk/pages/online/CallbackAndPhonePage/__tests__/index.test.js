import { handleTalkVendorLoaded, updateTalkCallbackForm } from 'classicSrc/embeds/talk/actions'
import createStore from 'classicSrc/redux/createStore'
import { render, dispatchUpdateEmbeddableConfig } from 'classicSrc/util/testHelpers'
import * as libphonenumber from 'libphonenumber-js'
import CallbackAndPhonePage from '../index'

const renderComponent = (params = { country: 'AU' }) => {
  const store = createStore()

  store.dispatch(handleTalkVendorLoaded({ libphonenumber }))
  dispatchUpdateEmbeddableConfig(store, {
    phoneNumber: '+61234567890',
  })
  store.dispatch(updateTalkCallbackForm({ country: params.country }))
  return render(<CallbackAndPhonePage />, { store })
}

it('renders the header message and the form', () => {
  const { queryByText, queryByLabelText } = renderComponent()

  expect(queryByText("Enter your phone number and we'll call you back.")).toBeInTheDocument()
  expect(queryByLabelText(/Name/)).toBeInTheDocument()
  expect(queryByLabelText(/How can we help/)).toBeInTheDocument()
  expect(queryByLabelText(/Phone Number/)).toBeInTheDocument()
  expect(queryByText(/Send/)).toBeInTheDocument()
})

it('renders the formatted callback phone number', () => {
  const { queryByText } = renderComponent()
  expect(queryByText('+61 2 3456 7890')).toBeInTheDocument()
})
