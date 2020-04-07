import React from 'react'
import { createMemoryHistory } from 'history'
import { render } from 'src/util/testHelpers'
import { Component as TicketFormPage } from '../'
import { TEST_IDS } from 'constants/shared'
import routes from 'src/embeds/support/routes'

describe('TicketFormPage', () => {
  const defaultProps = {
    formTitle: 'Form title',
    formId: 'formId',
    formState: {},
    readOnlyState: {},
    ticketFields: [],
    ticketForms: [],
    dragStarted: jest.fn(),
    amountOfCustomForms: 1,
    formExists: true,
    isLoading: false
  }

  const renderComponent = (props = {}, options) =>
    render(<TicketFormPage {...defaultProps} {...props} />, options)

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

  it('redirects to the support home when form does not exist', async () => {
    const history = createMemoryHistory({ initialEntries: [routes.form(defaultProps.formId)] })
    renderComponent({ formExists: false }, { history })

    expect(history.location.pathname).toEqual(routes.home())
  })

  it('redirects to the support home when viewing default form, but there are now custom forms to view', async () => {
    const history = createMemoryHistory({ initialEntries: [routes.form(routes.defaultFormId)] })
    renderComponent({ formId: routes.defaultFormId, amountOfCustomForms: 1 }, { history })

    expect(history.location.pathname).toEqual(routes.home())
  })

  it('displays a loading page if a request is pending', () => {
    const { queryByRole } = renderComponent({ isLoading: true })
    expect(queryByRole('progressbar')).toBeInTheDocument()
  })
})
