import React from 'react'
import { render } from 'src/util/testHelpers'
import { Component as TicketFormPage } from '../'
import { TEST_IDS } from 'constants/shared'

describe('TicketFormPage', () => {
  const defaultProps = {
    formTitle: 'Form title',
    formName: 'Form name',
    formState: {},
    readOnlyState: {},
    ticketFields: []
  }

  const renderComponent = (props = {}) => render(<TicketFormPage {...defaultProps} {...props} />)

  it('renders the form title in the widget header', () => {
    const { queryByText } = renderComponent({ formTitle: 'Some title' })

    expect(queryByText('Some title')).toBeInTheDocument()
  })

  it('renders the ticket form', () => {
    const { queryByTestId } = renderComponent({ formTitle: 'Some title' })

    expect(queryByTestId(TEST_IDS.SUPPORT_TICKET_FORM)).toBeInTheDocument()
  })
})
