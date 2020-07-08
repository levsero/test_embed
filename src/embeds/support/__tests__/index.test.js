import React from 'react'
import { render } from 'src/util/testHelpers'
import { Component as Support } from '../'
import createStore from 'src/redux/createStore'
import { TICKET_FORMS_REQUEST_SUCCESS } from 'embeds/support/actions/action-types'
import { updateEmbeddableConfig } from 'src/redux/modules/base'
import { waitFor } from '@testing-library/dom'

describe('TicketFormPage', () => {
  const renderComponent = (props = {}, options) => {
    const defaultProps = {
      ticketForms: [],
      formIds: [],
      fetchTicketForms: jest.fn(async () => undefined),
      getTicketFields: jest.fn(async () => undefined),
      locale: 'en-US',
      customFieldsAvailable: false
    }

    return render(<Support {...defaultProps} {...props} />, options)
  }

  it('renders the default form when ticketForms length is 0', async () => {
    const { queryByText } = renderComponent()

    await waitFor(() => queryByText('Email address'))

    expect(queryByText('Email address')).toBeInTheDocument()
    expect(queryByText('How can we help you?')).toBeInTheDocument()
    expect(queryByText('Please select your issue')).not.toBeInTheDocument()
  })

  it('does not fetch data when forms and custom fields not available', () => {
    const getTicketFields = jest.fn(async () => undefined)
    const fetchTicketForms = jest.fn(async () => undefined)

    renderComponent({
      getTicketFields,
      fetchTicketForms,
      formIds: [],
      locale: 'en-US'
    })

    expect(getTicketFields).not.toHaveBeenCalled()
    expect(fetchTicketForms).not.toHaveBeenCalled()
  })

  it('renders the ticket form form when ticketForms length is 1', async () => {
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
        ticket_fields: [],
        formIds: []
      }
    })
    const { queryByText } = renderComponent({ ticketForms: [{ id: 1 }] }, { store })

    await waitFor(() => queryByText('Email address'))

    expect(queryByText('Email address')).toBeInTheDocument()
    expect(queryByText('How can we help you?')).not.toBeInTheDocument()
    expect(queryByText('Please select your issue')).not.toBeInTheDocument()
  })

  it('renders the list when ticketForms length is greater than 1', async () => {
    const { queryByText } = renderComponent({ ticketForms: [{ id: 1 }, { id: 2 }] })

    await waitFor(() => queryByText('Email address'))

    expect(queryByText('Email address')).not.toBeInTheDocument()
    expect(queryByText('How can we help you?')).not.toBeInTheDocument()
    expect(queryByText('Please select your issue')).toBeInTheDocument()
  })

  it('fetches ticket fields when no ticket forms and customFieldsAvailable', () => {
    const getTicketFields = jest.fn(async () => undefined)

    const { rerender } = renderComponent({
      getTicketFields,
      formIds: [],
      locale: 'en-US',
      customFieldsAvailable: true
    })

    expect(getTicketFields).toHaveBeenCalledWith('en-US')

    getTicketFields.mockClear()

    renderComponent(
      { formIds: [], getTicketFields, locale: 'ru', customFieldsAvailable: true },
      { render: rerender }
    )

    expect(getTicketFields).toHaveBeenCalledWith('ru')
  })

  it('fetches ticket forms when list of filtered forms changes', () => {
    const fetchTicketForms = jest.fn(async () => undefined)

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

  it('renders the loading page when fetching custom forms on first render', async () => {
    const { queryByRole } = renderComponent({
      formIds: [123],
      locale: 'en-US'
    })

    expect(queryByRole('progressbar')).toBeInTheDocument()

    await waitFor(() => {})

    expect(queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
