import { waitFor } from '@testing-library/dom'
import { TICKET_FORMS_REQUEST_SUCCESS } from 'embeds/support/actions/action-types'
import createStore from 'src/redux/createStore'
import { updateEmbeddableConfig } from 'src/redux/modules/base'
import { ALL_FORMS_REQUESTED } from 'src/redux/modules/settings/settings-action-types'
import { render } from 'src/util/testHelpers'
import { Component as Support } from '../'

describe('TicketFormPage', () => {
  const renderComponent = (props = {}, options) => {
    const defaultProps = {
      ticketForms: { ids: [], enabled: true },
      fetchTicketForms: jest.fn(async () => undefined),
      getTicketFields: jest.fn(async () => undefined),
      locale: 'en-US',
      customFieldsAvailable: false,
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

  it('falls back to the default form when an invalid ID is the only ID passed', async () => {
    const store = createStore()
    store.dispatch(
      updateEmbeddableConfig({
        embeds: {
          ticketSubmissionForm: {
            props: {
              ticketFormsEnabled: true,
            },
          },
        },
      })
    )

    store.dispatch({
      type: ALL_FORMS_REQUESTED,
      payload: false,
    })

    store.dispatch({
      type: TICKET_FORMS_REQUEST_SUCCESS,
      payload: {
        ticket_forms: [
          {
            id: 666,
            active: true,
            ticket_field_ids: [],
          },
        ],
        ticket_fields: [],
        formIds: [],
      },
    })

    const ticketForms = { ids: [1337], validatedIds: [], enabled: true, showList: false }
    const { queryByText } = renderComponent({ ticketForms: ticketForms }, { store })

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
      ticketForms: { enabled: false, ids: [] },
      locale: 'en-US',
    })

    expect(getTicketFields).not.toHaveBeenCalled()
    expect(fetchTicketForms).not.toHaveBeenCalled()
  })

  it('renders the ticket form when ticketForms length is 1', async () => {
    const store = createStore()
    store.dispatch(
      updateEmbeddableConfig({
        embeds: {
          ticketSubmissionForm: {
            props: {
              ticketFormsEnabled: true,
            },
          },
        },
      })
    )

    store.dispatch({
      type: ALL_FORMS_REQUESTED,
      payload: true,
    })

    store.dispatch({
      type: TICKET_FORMS_REQUEST_SUCCESS,
      payload: {
        ticket_forms: [
          {
            id: 1337,
            active: true,
            ticket_field_ids: [],
          },
        ],
        ticket_fields: [],
        formIds: [],
      },
    })

    const ticketForms = { ids: [1337], validatedIds: [1337], enabled: true, showList: false }
    const { queryByText } = renderComponent({ ticketForms: ticketForms }, { store })

    await waitFor(() => queryByText('Email address'))

    expect(queryByText('Email address')).toBeInTheDocument()
    expect(queryByText('How can we help you?')).not.toBeInTheDocument()
    expect(queryByText('Please select your issue')).not.toBeInTheDocument()
  })

  it('renders the list when ticketForms length is greater than 1', async () => {
    const ticketForms = { ids: [1, 2], enabled: true, showList: true }
    const { queryByText } = renderComponent({ ticketForms: ticketForms })

    await waitFor(() => queryByText('Email address'))

    expect(queryByText('Email address')).not.toBeInTheDocument()
    expect(queryByText('How can we help you?')).not.toBeInTheDocument()
    expect(queryByText('Please select your issue')).toBeInTheDocument()
  })

  it('fetches ticket fields when no ticket forms and customFieldsAvailable', () => {
    const getTicketFields = jest.fn(async () => undefined)

    const { rerender } = renderComponent({
      getTicketFields,
      ticketForms: { ids: [] },
      locale: 'en-US',
      customFieldsAvailable: true,
    })

    expect(getTicketFields).toHaveBeenCalledWith('en-US')

    getTicketFields.mockClear()

    renderComponent(
      { ticketForms: { ids: [] }, getTicketFields, locale: 'ru', customFieldsAvailable: true },
      { render: rerender }
    )

    expect(getTicketFields).toHaveBeenCalledWith('ru')
  })

  it('fetches ticket forms when list of filtered forms changes', () => {
    const fetchTicketForms = jest.fn(async () => undefined)

    const { rerender } = renderComponent({
      fetchTicketForms,
      ticketForms: { ids: [123, 456], active: true },
      locale: 'en-US',
    })

    expect(fetchTicketForms).toHaveBeenCalledWith({ ids: [123, 456], active: true }, 'en-US')

    fetchTicketForms.mockClear()

    renderComponent(
      { ticketForms: { ids: [456, 789], active: true }, fetchTicketForms, locale: 'en-US' },
      { render: rerender }
    )

    expect(fetchTicketForms).toHaveBeenCalledWith({ ids: [456, 789], active: true }, 'en-US')
  })

  it('renders the loading page when fetching custom forms on first render', async () => {
    const store = createStore()

    store.dispatch(
      updateEmbeddableConfig({
        embeds: {
          ticketSubmissionForm: {
            props: {
              ticketFormsEnabled: true,
            },
          },
        },
      })
    )

    store.dispatch({
      type: ALL_FORMS_REQUESTED,
      payload: true,
    })

    store.dispatch({
      type: TICKET_FORMS_REQUEST_SUCCESS,
      payload: {
        ticket_forms: [
          {
            id: 1337,
            active: true,
            ticket_field_ids: [],
          },
        ],
        ticket_fields: [],
        formIds: [],
      },
    })

    const { queryByRole } = renderComponent(
      {
        ticketForms: { ids: [1337], active: true, showList: true },
        locale: 'en-US',
      },
      { store }
    )

    expect(queryByRole('progressbar')).toBeInTheDocument()

    await waitFor(() => {})

    expect(queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
