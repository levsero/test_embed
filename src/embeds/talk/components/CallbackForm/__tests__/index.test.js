import React from 'react'
import { render } from '@testing-library/react'
import { Component as CallbackForm } from '../'
import createStore from 'src/redux/createStore'
import { Provider } from 'react-redux'
import { handleTalkVendorLoaded } from 'src/redux/modules/talk'
import * as libphonenumber from 'libphonenumber-js'

describe('CallbackForm', () => {
  const defaultProps = {
    supportedCountries: ['AU', 'US'],
    formState: {
      name: 'Someone',
      description: 'A thing went wrong with the thing'
    },
    callback: {
      error: {
        message: ''
      }
    },
    averageWaitTime: 'Average wait time: 25m',
    updateTalkCallbackForm: jest.fn(),
    submitTalkCallbackForm: jest.fn(),
    isMobile: false,
    nickname: 'Nick name',
    serviceUrl: 'https://example.com',
    nameLabelText: 'Name',
    descriptionLabelText: 'Description',
    isRTL: false,
    submitButtonLabel: 'Submit',
    headerMessage: 'Register a callback',
    locale: 'en'
  }

  const renderComponent = (props = {}) => {
    const store = createStore()

    store.dispatch(handleTalkVendorLoaded({ libphonenumber }))

    return render(
      <Provider store={store}>
        <CallbackForm {...defaultProps} {...props} />
      </Provider>
    )
  }

  it('renders the header message', () => {
    const { queryByText } = renderComponent()

    expect(queryByText(defaultProps.headerMessage)).toBeInTheDocument()
  })

  it('displays the average wait time if it is available', () => {
    const { queryByText } = renderComponent()

    expect(queryByText(defaultProps.averageWaitTime)).toBeInTheDocument()
  })

  it('does not display the average wait time if it is not available', () => {
    const { queryByTestId } = renderComponent({ averageWaitTime: null })

    expect(queryByTestId('averageWaitTime')).not.toBeInTheDocument()
  })

  it('renders a field for the users name', () => {
    const { queryByText } = renderComponent()

    expect(queryByText(defaultProps.nameLabelText)).toBeInTheDocument()
    expect(document.querySelector(`input[name="name"]`)).toHaveValue(defaultProps.formState.name)
  })

  it('renders a field for the user to enter a description', () => {
    const { queryByText } = renderComponent()

    expect(queryByText(defaultProps.descriptionLabelText)).toBeInTheDocument()
    expect(document.querySelector(`textarea[name="description"]`)).toHaveValue(
      defaultProps.formState.description
    )
  })

  it('displays an error message the phone number is invalid', () => {
    const message = 'invalid_phone_number'
    const expectedErrorMessage = 'Please enter a valid phone number.'

    const { queryByText } = renderComponent({ callback: { error: { message } } })

    expect(queryByText(expectedErrorMessage)).toBeInTheDocument()
  })

  it('displays an error message when the phone number is already in the queue', () => {
    const message = 'phone_number_already_in_queue'
    const expectedErrorMessage = "You've already submitted a request. We'll get back to you soon."

    const { queryByText } = renderComponent({ callback: { error: { message } } })

    expect(queryByText(expectedErrorMessage)).toBeInTheDocument()
  })

  it('does not display an error message when there is no error', () => {
    const { queryByTestId } = renderComponent({ callback: { error: { message: null } } })

    expect(queryByTestId('Icon--error')).not.toBeInTheDocument()
  })
})
