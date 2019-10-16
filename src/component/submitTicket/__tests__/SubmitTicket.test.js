import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import snapshotDiff from 'snapshot-diff'

import { ContextProvider } from 'src/util/testHelpers'
import { IdManager } from '@zendeskgarden/react-selection'
import { TEST_IDS } from 'src/constants/shared'
import { Component as SubmitTicket } from '../SubmitTicket'
import trackTicketSubmitted from 'embeds/support/utils/track-ticket-submitted'

jest.mock('embeds/support/utils/track-ticket-submitted')

const renderComponent = props => {
  const component = submitTicket(props)
  return render(component)
}

const submitTicket = props => {
  const defaultProps = {
    attachmentSender: noop,
    submit: noop,
    formTitle: 'message',
    nameFieldRequired: false,
    nameFieldEnabled: true,
    errorMsg: '',
    locale: 'en-US',
    formState: {},
    readOnlyState: {},
    loading: false,
    handleTicketSubmission: noop,
    ticketForms: [],
    ticketFormsAvailable: false,
    ticketFields: {},
    handleFormChange: noop,
    handleTicketFormClick: noop,
    fullscreen: false,
    showNotification: false,
    selectTicketFormLabel: 'submit ticket form',
    onCancelClick: jest.fn()
  }
  const mergedProps = { ...defaultProps, ...props }
  IdManager.setIdCounter(0)

  return (
    <ContextProvider>
      <SubmitTicket {...mergedProps} />
    </ContextProvider>
  )
}

test('renders the expected components', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

test('renders the expected components in mobile mode', () => {
  const { container } = renderComponent({ isMobile: true })
  const desktop = renderComponent()

  expect(snapshotDiff(desktop.container, container, { contextLines: 2 })).toMatchSnapshot()
})

describe('ticket forms list ', () => {
  it('renders ticket forms page', () => {
    const ticketForms = [
      { id: 1, display_name: 'Form One' },
      { id: 2, display_name: 'Form Two' },
      { id: 3, display_name: 'Form Three' }
    ]

    const { queryByText } = renderComponent({
      showNotification: false,
      ticketForms,
      activeTicketForm: null
    })

    expect(queryByText('Please select your issue')).toBeInTheDocument()
    expect(queryByText('Leave us a message')).toBeInTheDocument()
  })
})

describe('active ticket form', () => {
  /* eslint-disable camelcase */
  const activeTicketForm = {
    id: 1,
    raw_name: 'Ticket Formz',
    display_name: 'Ticket Forms'
  }
  const activeTicketFormFields = [
    { id: 1, type: 'text', title_in_portal: 'Description' },
    { id: 2, type: 'subject', title_in_portal: 'Subject' },
    { id: 5, type: 'text', title_in_portal: 'Favorite Pizza', required_in_portal: true }
  ]
  /* eslint-enable camelcase */

  it('renders the expected components', () => {
    const { container } = renderComponent({
      activeTicketForm,
      activeTicketFormFields
    })

    expect(container).toMatchSnapshot()
  })

  it('renders the expected components in mobile form', () => {
    const { container } = renderComponent({
      activeTicketForm,
      activeTicketFormFields,
      isMobile: true,
      fullscreen: true
    })
    const desktop = renderComponent({
      activeTicketForm,
      activeTicketFormFields
    })

    expect(snapshotDiff(desktop.container, container, { contextLines: 2 })).toMatchSnapshot()
  })
})

test('can hide the zendesk logo', () => {
  const { queryByTestId } = renderComponent({ hideZendeskLogo: true })

  expect(queryByTestId(TEST_IDS.ICON_ZENDESK)).not.toBeInTheDocument()
})

test('renders the error message', () => {
  const { queryByText } = renderComponent({ errorMsg: 'this is the error message' })

  expect(queryByText('this is the error message')).toBeInTheDocument()
})

test('renders the loading bar content', () => {
  const { container } = renderComponent({ loading: true })

  expect(container.firstChild).toMatchSnapshot()
})

test('renders the success notification', () => {
  const { queryByText } = renderComponent({ showNotification: true })

  expect(queryByText('Thanks for reaching out.')).toBeInTheDocument()
  expect(queryByText("We'll get back to you soon.")).toBeInTheDocument()
  expect(queryByText('Done')).toBeInTheDocument()
})

test('renders the attachment box when something is dragged to it', () => {
  let ref
  const component = (
    <div data-testid="container" onDragEnter={() => ref.handleDragEnter()}>
      {submitTicket({ attachmentsEnabled: true, ref: x => (ref = x) })}
    </div>
  )
  const { getByTestId, queryByText, queryByTestId } = render(component)

  fireEvent.dragEnter(getByTestId('container'))
  expect(queryByTestId(TEST_IDS.ICON_PAPERCLIP_LARGE)).toBeInTheDocument()
  expect(queryByText('Drop to attach')).toBeInTheDocument()
})

describe('form submission', () => {
  /* eslint-disable camelcase */
  const activeTicketForm = {
    id: 1,
    raw_name: 'Ticket Formz',
    display_name: 'Ticket Forms'
  }
  const activeTicketFormFields = [{ id: 1, type: 'text', title_in_portal: 'Description' }]
  /* eslint-enable camelcase */

  const submit = utils => {
    fireEvent.change(utils.getByLabelText('Your name (optional)'), {
      target: { value: 'Bruised Wayne' }
    })
    fireEvent.change(utils.getByLabelText('Email address'), {
      target: { value: 'me@wayne.com' }
    })
    fireEvent.change(utils.getByLabelText('Description (optional)'), {
      target: { value: 'hello world' }
    })
    fireEvent.click(utils.getByText('Send'))
  }

  it('does the expected actions on submit', () => {
    const handleTicketSubmission = jest.fn()
    const utils = renderComponent({
      activeTicketForm,
      activeTicketFormFields,
      handleTicketSubmission
    })
    submit(utils)
    expect(handleTicketSubmission).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Function)
    )
  })

  it('does not call handleTicketSubmission on submit if validation fails', () => {
    const handleTicketSubmission = jest.fn()
    const { queryByText } = renderComponent({
      activeTicketForm,
      activeTicketFormFields,
      handleTicketSubmission
    })

    fireEvent.click(queryByText('Send'))
    expect(handleTicketSubmission).not.toHaveBeenCalled()
    expect(queryByText('Please enter a valid email address.')).toBeInTheDocument()
  })

  describe('callbacks', () => {
    it('does the expected actions on success', () => {
      const handleTicketSubmission = jest.fn()
      const utils = renderComponent({
        activeTicketForm,
        activeTicketFormFields,
        handleTicketSubmission,
        searchTerm: 'blah',
        locale: 'fr',
        hasContextuallySearched: true,
        formState: {
          email: 'he@man.com'
        }
      })
      submit(utils)
      const done = handleTicketSubmission.mock.calls[0][1]
      done({ x: 1 })
      expect(trackTicketSubmitted).toHaveBeenCalledWith({
        res: { x: 1 },
        email: 'he@man.com',
        searchTerm: 'blah',
        searchLocale: 'fr',
        contextualSearch: true
      })
    })

    it('acts as fail if done callback is called with error response', () => {
      const handleTicketSubmission = jest.fn(),
        onSubmitted = jest.fn()
      const utils = renderComponent({
        activeTicketForm,
        activeTicketFormFields,
        handleTicketSubmission,
        onSubmitted
      })
      submit(utils)
      const done = handleTicketSubmission.mock.calls[0][1]
      done({ error: 'blah' })
      expect(onSubmitted).not.toHaveBeenCalled()
    })

    it('does the expected actions on fail', () => {
      const handleTicketSubmission = jest.fn(),
        onSubmitted = jest.fn()
      const utils = renderComponent({
        activeTicketForm,
        activeTicketFormFields,
        handleTicketSubmission,
        onSubmitted
      })
      submit(utils)
      const fail = handleTicketSubmission.mock.calls[0][2]
      fail()
      expect(onSubmitted).not.toHaveBeenCalled()
    })
  })
})
