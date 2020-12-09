import React from 'react'
import { render } from 'utility/testHelpers'
import { Component as CallbackForm } from '../'
import { TEST_IDS } from 'src/constants/shared'
import getFormattedPhoneNumber from 'src/embeds/talk/utils/getFormattedPhoneNumber'

jest.mock('src/embeds/talk/utils/getFormattedPhoneNumber')

beforeEach(() => {
  getFormattedPhoneNumber.mockReturnValue('1800-7383773')
})

describe('CallbackForm', () => {
  const defaultProps = {
    averageWaitTime: 'Average wait time: 25m',
    callback: {
      error: {
        message: ''
      }
    },
    descriptionLabelText: 'Description',
    formState: {
      description: 'A thing went wrong with the thing',
      name: 'Someone'
    },
    nameLabelText: 'Name',
    nickname: 'Nick name',
    serviceUrl: 'https://example.com',
    showCallbackNumber: false,
    submitTalkCallbackForm: jest.fn(),
    supportedCountries: ['AU', 'US'],
    updateTalkCallbackForm: jest.fn()
  }

  const renderComponent = (props = {}) => render(<CallbackForm {...defaultProps} {...props} />)

  it('renders the header message', () => {
    const { queryByText } = renderComponent()

    expect(queryByText("Enter your phone number and we'll call you back.")).toBeInTheDocument()
  })

  it('displays the average wait time if it is available', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Average wait time: 25m')).toBeInTheDocument()
  })

  it('does not display the average wait time if it is not available', () => {
    const { queryByTestId } = renderComponent({ averageWaitTime: null })

    expect(queryByTestId(TEST_IDS.TALK_AVG_WAIT_TIME)).not.toBeInTheDocument()
  })

  it('renders a field for the users name', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Name')).toBeInTheDocument()
    expect(document.querySelector(`input[name="name"]`)).toHaveValue('Someone')
  })

  it('renders a field for the user to enter a description', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Description')).toBeInTheDocument()
    expect(document.querySelector(`textarea[name="description"]`)).toHaveValue(
      'A thing went wrong with the thing'
    )
  })

  it('displays an error message the phone number is invalid', () => {
    const message = 'invalid_phone_number'
    const expectedErrorMessage = 'Please enter a valid phone number.'

    const { queryByText, queryByTestId } = renderComponent({ callback: { error: { message } } })

    expect(queryByTestId(TEST_IDS.ERROR_MSG)).toBeInTheDocument()
    expect(queryByText(new RegExp(expectedErrorMessage, 'i'))).toBeInTheDocument()
  })

  it('displays an error message when the phone number is already in the queue', () => {
    const message = 'phone_number_already_in_queue'
    const expectedErrorMessage = "You've already submitted a request. We'll get back to you soon."

    const { queryByText, queryByTestId } = renderComponent({ callback: { error: { message } } })

    expect(queryByTestId(TEST_IDS.ERROR_MSG)).toBeInTheDocument()
    expect(queryByText(new RegExp(expectedErrorMessage, 'i'))).toBeInTheDocument()
  })

  it('does not display an error message when there is no error', () => {
    const { queryByTestId } = renderComponent({ callback: { error: { message: null } } })

    expect(queryByTestId(TEST_IDS.ERROR_MSG)).not.toBeInTheDocument()
  })
})
