import { fireEvent, queryByAltText } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TEST_IDS } from 'src/constants/shared/'
import createStore from 'src/redux/createStore'
import { handleTalkVendorLoaded } from 'src/redux/modules/talk'
import { http } from 'src/service/transport'
import { render, dispatchUpdateEmbeddableConfig } from 'utility/testHelpers'
import Talk from '../../'

jest.mock('src/service/transport')

const setUpComponent = (config = {}) => {
  const store = createStore()

  store.dispatch(handleTalkVendorLoaded({}))

  dispatchUpdateEmbeddableConfig(store, {
    averageWaitTimeSetting: null,
    capability: '0',
    enabled: true,
    nickname: 'yolo',
    phoneNumber: '+61422422249',
    supportedCountries: 'US,AU',
    connected: true,
    agentAvailability: true,
    ...config,
  })
  http.callMeRequest = (__, options) => {
    options.callbacks.done()
    return { phone_number: '+15417543010' }
  }

  const result = render(<Talk isMobile={false} />, { store })

  return {
    ...result,
    store,
  }
}

const getSelectedCountry = (utils, value) => {
  return queryByAltText(utils.queryByTestId(TEST_IDS.DROPDOWN_FIELD), value)
}

const submitForm = (utils) => fireEvent.click(utils.getByText('Send'))
const updatePhonefield = (utils, number) => {
  const phoneField = utils.getByLabelText('Phone Number')

  fireEvent.change(phoneField, { target: { value: number } })
}

const checkForForm = (utils) => {
  expect(utils.queryByText("Enter your phone number and we'll call you back.")).toBeInTheDocument()
}
const checkForErrorMessage = (utils) => {
  expect(utils.queryByText('Please enter a valid phone number.')).toBeInTheDocument()
}
const checkForNoErrorMessage = (utils) => {
  expect(utils.queryByText('Please enter a valid phone number.')).not.toBeInTheDocument()
}
const checkForFlag = (utils) => {
  expect(getSelectedCountry(utils, 'US')).toBeInTheDocument()
  expect(getSelectedCountry(utils, 'AU')).not.toBeInTheDocument()
}
const checkForSuccessMesage = (utils) => {
  expect(utils.queryByText('Thanks for reaching out')).toBeInTheDocument()
  expect(utils.queryByText('Someone will get back to you soon')).toBeInTheDocument()
}

const checkForPhoneOnlyPage = (utils, props) => {
  expect(utils.queryByTestId(TEST_IDS.TALK_PHONE_ONLY_PAGE)).toBeInTheDocument()
  checkForPhoneNumber(utils, props)
}

const checkForPhoneNumber = (utils, { phoneNumber, formattedPhoneNumber, averageWaitTime }) => {
  expect(utils.queryByText(formattedPhoneNumber)).toBeInTheDocument()
  expect(utils.queryByText(`Average wait time: ${averageWaitTime} minutes`)).toBeInTheDocument()
  expect(document.querySelector(`[href="tel:${phoneNumber}"]`)).toBeInTheDocument()
}

test('limit phone input field length based on libphonenumber-js validation', () => {
  const utils = setUpComponent()
  checkForForm(utils)
  userEvent.type(utils.getByLabelText('Phone Number'), '2222333344445555666677778888')
  expect(utils.getByLabelText('Phone Number').value).toEqual('+1 22223333444455556')
})

test('phone number is displayed as the user types', () => {
  const utils = setUpComponent()
  checkForForm(utils)
  userEvent.type(utils.getByLabelText('Phone Number'), '5417543010')
  expect(utils.getByLabelText('Phone Number').value).toEqual('+1 541 754 3010')
})

test('error message is not displayed on initial page load', () => {
  const utils = setUpComponent()
  checkForForm(utils)
  userEvent.type(utils.getByLabelText('Phone Number'), '+15417543010')
  checkForNoErrorMessage(utils)
  userEvent.type(utils.getByLabelText('Phone Number'), '+1111111111111111111111111111111111')
  checkForNoErrorMessage(utils)
  submitForm(utils)
  checkForErrorMessage(utils)
  userEvent.clear(utils.getByLabelText('Phone Number'))
  userEvent.type(utils.getByLabelText('Phone Number'), '5417543010')
  checkForNoErrorMessage(utils)
})

test('talk callback submission', () => {
  const utils = setUpComponent()

  checkForForm(utils)

  submitForm(utils)
  checkForErrorMessage(utils) // empty phone number error

  updatePhonefield(utils, '12345678')
  submitForm(utils)
  checkForErrorMessage(utils) // incorrect phone number error

  updatePhonefield(utils, '+15417543010')
  checkForFlag(utils)
  submitForm(utils)
  checkForSuccessMesage(utils)
})

test('phone only page', () => {
  const phoneNumber = '+61412345678'
  const formattedPhoneNumber = '+61 412 345 678'
  const averageWaitTime = '10'

  const utils = setUpComponent({
    phoneNumber,
    averageWaitTime,
    capability: '1',
    averageWaitTimeSetting: true,
    averageWaitTimeEnabled: true,
  })

  checkForPhoneOnlyPage(utils, {
    phoneNumber,
    formattedPhoneNumber,
    averageWaitTime,
  })
})

test('callback and phone only', () => {
  const phoneNumber = '+61412345678'
  const formattedPhoneNumber = '+61 412 345 678'
  const averageWaitTime = '15'

  const utils = setUpComponent({
    phoneNumber,
    averageWaitTime,
    capability: '2',
    averageWaitTimeSetting: true,
    averageWaitTimeEnabled: true,
  })

  checkForPhoneNumber(utils, {
    phoneNumber,
    formattedPhoneNumber,
    averageWaitTime,
  })

  checkForForm(utils)

  submitForm(utils)
  checkForErrorMessage(utils) // empty phone number error

  updatePhonefield(utils, '12345678')
  submitForm(utils)
  checkForErrorMessage(utils) // incorrect phone number error

  updatePhonefield(utils, '+15417543010')
  checkForFlag(utils)
  submitForm(utils)
  checkForSuccessMesage(utils)
})

test('talk offline page', () => {
  const { queryByText } = setUpComponent({
    agentAvailability: false,
    capability: '0',
  })

  expect(queryByText('All agents are currently offline. Try again later.')).toBeInTheDocument()
})
