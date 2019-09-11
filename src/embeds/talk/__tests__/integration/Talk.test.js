import { render, fireEvent, queryByAltText } from '@testing-library/react'
import React from 'react'
import createStore from 'src/redux/createStore'
import { Provider } from 'react-redux'
import libphonenumber from 'libphonenumber-js'

import { handleTalkVendorLoaded } from 'src/redux/modules/talk'
import { dispatchUpdateEmbeddableConfig } from 'utility/testHelpers'
import Talk from '../../'
import { http } from 'service/transport'
import { MemoryRouter } from 'react-router-dom'
import { TEST_IDS } from 'src/constants/shared/'

jest.mock('service/transport')

const setUpComponent = () => {
  const store = createStore()

  store.dispatch(handleTalkVendorLoaded({ libphonenumber: libphonenumber }))

  dispatchUpdateEmbeddableConfig(store, {
    averageWaitTimeSetting: null,
    capability: '0',
    enabled: true,
    nickname: 'yolo',
    phoneNumber: '+61422422249',
    supportedCountries: 'US,AU',
    connected: true,
    agentAvailability: true
  })
  http.callMeRequest = (__, options) => {
    options.callbacks.done()
    return { phone_number: '+15417543010' }
  }

  const result = render(
    <MemoryRouter>
      <Provider store={store}>
        <Talk isMobile={false} />
      </Provider>
    </MemoryRouter>
  )

  return {
    ...result,
    store
  }
}

const getSelectedCountry = (utils, value) => {
  return queryByAltText(utils.queryByTestId(TEST_IDS.DROPDOWN_SELECTED), value)
}

const submitForm = utils => fireEvent.click(utils.getByText('Send'))
const updatePhonefield = (utils, number) => {
  const phoneField = utils.getByLabelText('Phone Number')

  fireEvent.change(phoneField, { target: { value: number } })
}

const checkForForm = utils => {
  expect(utils.queryByText("Enter your phone number and we'll call you back.")).toBeInTheDocument()
}
const checkForErrorMessage = utils => {
  expect(utils.queryByText('Please enter a valid phone number.')).toBeInTheDocument()
}
const checkForFlag = utils => {
  expect(getSelectedCountry(utils, 'US')).toBeInTheDocument()
  expect(getSelectedCountry(utils, 'AU')).not.toBeInTheDocument()
}
const checkForSuccessMesage = utils => {
  expect(utils.queryByText('Thanks for reaching out.')).toBeInTheDocument()
  expect(utils.queryByText("We'll get back to you soon.")).toBeInTheDocument()
}

const checkForPhoneOnlyPage = (utils, { phoneNumber, formattedPhoneNumber, averageWaitTime }) => {
  expect(utils.queryByTestId(TEST_IDS.TALK_PHONE_ONLY_PAGE)).toBeInTheDocument()
  expect(utils.queryByText(formattedPhoneNumber)).toBeInTheDocument()
  expect(utils.queryByText(`Average wait time: ${averageWaitTime} minutes`)).toBeInTheDocument()
  expect(document.querySelector(`[href="tel:${phoneNumber}"]`)).toBeInTheDocument()
}

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

  const utils = setUpComponent()

  dispatchUpdateEmbeddableConfig(utils.store, {
    phoneNumber,
    averageWaitTime,
    capability: '1',
    averageWaitTimeSetting: true,
    averageWaitTimeEnabled: true
  })

  checkForPhoneOnlyPage(utils, {
    phoneNumber,
    formattedPhoneNumber,
    averageWaitTime
  })
})
