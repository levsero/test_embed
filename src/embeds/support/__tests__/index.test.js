import React from 'react'
import { render } from 'src/util/testHelpers'
import { Component as Support } from '../'

describe('TicketFormPage', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      ticketForms: [],
      isLoading: false
    }

    return render(<Support {...defaultProps} {...props} />)
  }

  it('renders the LoadingPage when isLoading is true', () => {
    const { queryByRole } = renderComponent({ isLoading: true })
    expect(queryByRole('progressbar')).toBeInTheDocument()
  })

  it('renders the default form when ticketForms length is 0', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Email address')).toBeInTheDocument()
    expect(queryByText('How can we help you?')).toBeInTheDocument()
    expect(queryByText('Please select your issue')).not.toBeInTheDocument()
  })

  it('renders the ticket form form when ticketForms length is 1', () => {
    const { queryByText } = renderComponent({ ticketForms: [{ id: 1 }] })

    expect(queryByText('Email address')).toBeInTheDocument()
    expect(queryByText('How can we help you?')).not.toBeInTheDocument()
    expect(queryByText('Please select your issue')).not.toBeInTheDocument()
  })

  it('renders the list when ticketForms length is greater than 1', () => {
    const { queryByText } = renderComponent({ ticketForms: [{ id: 1 }, { id: 2 }] })

    expect(queryByText('Email address')).not.toBeInTheDocument()
    expect(queryByText('How can we help you?')).not.toBeInTheDocument()
    expect(queryByText('Please select your issue')).toBeInTheDocument()
  })
})
