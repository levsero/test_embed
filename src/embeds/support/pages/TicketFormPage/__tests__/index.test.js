import React from 'react'
import { render } from 'src/util/testHelpers'
import { Component as TicketFormPage } from '../'
import { TEST_IDS } from 'constants/shared'

describe('TicketFormPage', () => {
  const defaultProps = {
    formTitle: 'Form title',
    formId: 'formId',
    formState: {},
    readOnlyState: {},
    ticketFields: [],
    ticketForms: [],
    dragStarted: jest.fn()
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

  it('renders the FileDropProvider so that the attachments drop area can take up the whole widget view', () => {
    const { queryByTestId } = renderComponent()

    expect(queryByTestId(TEST_IDS.DROP_CONTAINER)).toBeInTheDocument()
  })
})
