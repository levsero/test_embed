import React from 'react'
import { render } from 'src/util/testHelpers'
import { Component as Support } from '../'
import createStore from 'src/redux/createStore'
import { TICKET_FORMS_REQUEST_SUCCESS } from 'embeds/support/actions/action-types'
import { updateEmbeddableConfig } from 'src/redux/modules/base'

describe('TicketFormPage', () => {
  const renderComponent = (props = {}, options) => {
    const defaultProps = {
      ticketForms: [],
      isLoading: false,
      formIds: [],
      fetchTicketForms: jest.fn(),
      locale: 'en-US'
    }

    return render(<Support {...defaultProps} {...props} />, options)
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
    const store = createStore()
    store.dispatch(
      updateEmbeddableConfig({
        embeds: {
          ticketSubmissionForm: {
            props: {
              ticketForms: [1]
            }
          }
        }
      })
    )
    store.dispatch({
      type: TICKET_FORMS_REQUEST_SUCCESS,
      payload: {
        ticket_forms: [
          {
            id: 1,
            active: true,
            ticket_field_ids: []
          }
        ],
        ticket_fields: []
      }
    })
    const { queryByText } = renderComponent({ ticketForms: [{ id: 1 }] }, { store })

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

  it('fetches ticket forms when list of filtered forms changes', () => {
    const fetchTicketForms = jest.fn()

    const { rerender } = renderComponent({
      fetchTicketForms,
      formIds: [123, 456],
      locale: 'en-US'
    })

    expect(fetchTicketForms).toHaveBeenCalledWith([123, 456], 'en-US')

    fetchTicketForms.mockClear()

    renderComponent(
      { formIds: [456, 789], fetchTicketForms, locale: 'en-US' },
      { render: rerender }
    )

    expect(fetchTicketForms).toHaveBeenCalledWith([456, 789], 'en-US')
  })
})
