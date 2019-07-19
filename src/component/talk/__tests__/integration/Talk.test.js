import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import createStore from 'src/redux/createStore'
import { Provider } from 'react-redux'
import libphonenumber from 'libphonenumber-js'

import {
  updateTalkEmbeddableConfig,
  handleTalkVendorLoaded,
  resetTalk
} from 'src/redux/modules/talk'
import Talk from '../../Talk'
import { http } from 'service/transport'

jest.mock('service/transport')

const setUpComponent = () => {
  const store = createStore()

  store.dispatch(handleTalkVendorLoaded({ libphonenumber: libphonenumber }))
  store.dispatch(
    updateTalkEmbeddableConfig({
      averageWaitTimeSetting: null,
      capability: '0',
      enabled: true,
      nickname: 'yolo',
      phoneNumber: '+61422422249',
      supportedCountries: 'US,AU',
      connected: true,
      agentAvailability: true
    })
  )
  http.callMeRequest = (__, options) => {
    options.callbacks.done()
    return { phone_number: '+15417543010' }
  }

  const result = render(
    <Provider store={store}>
      <Talk getFrameContentDocument={() => document} isMobile={false} />
    </Provider>
  )

  return {
    ...result,
    store
  }
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
  expect(utils.queryByAltText('US')).toBeInTheDocument()
  expect(utils.queryByAltText('AU')).not.toBeInTheDocument()
}
const checkForSuccessMesage = utils => {
  expect(utils.queryByText('Thanks for reaching out.')).toBeInTheDocument()
  expect(utils.queryByText("We'll get back to you soon.")).toBeInTheDocument()
}

const checkForPhoneOnlyPage = (utils, { phoneNumber, formattedPhoneNumber, averageWaitTime }) => {
  expect(utils.queryByTestId('talk--phoneOnlyPage')).toBeInTheDocument()
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

  utils.store.dispatch(
    updateTalkEmbeddableConfig({
      phoneNumber,
      averageWaitTime,
      capability: '1',
      averageWaitTimeSetting: true,
      averageWaitTimeEnabled: true
    })
  )

  utils.store.dispatch(resetTalk())

  checkForPhoneOnlyPage(utils, {
    phoneNumber,
    formattedPhoneNumber,
    averageWaitTime
  })
})
