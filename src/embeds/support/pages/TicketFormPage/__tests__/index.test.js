import React from 'react'
import { render } from 'src/util/testHelpers'
import { fireEvent } from '@testing-library/react'
import { Component as TicketFormPage } from '../'
import { TEST_IDS } from 'constants/shared'

describe('TicketFormPage', () => {
  const defaultProps = {
    formTitle: 'Form title',
    formName: 'Form name',
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

  it('fires dragStarted ondrag', () => {
    const dragStarted = jest.fn()
    const { container } = renderComponent({ dragStarted })
    const div = container.querySelector('div')

    fireEvent.dragEnter(div)
    expect(dragStarted).toHaveBeenCalled()
  })
})
