import { render } from 'react-testing-library'
import React from 'react'

import { SubmitTicketForm } from '../SubmitTicketForm'

const renderSubmitTicketForm = props => {
  const defaultProps = {
    attachmentSender: noop,
    getFrameContentDocument: noop,
    submit: noop,
    formTitle: 'message',
    nameFieldRequired: false,
    nameFieldEnabled: true
  }

  const mergedProps = { ...defaultProps, ...props }

  return render(<SubmitTicketForm {...mergedProps} />)
}

describe('#renderNameField', () => {
  it('renders the name field with correct name props', () => {
    const { container } = renderSubmitTicketForm()

    expect(container.querySelector('input[name="name"]')).toMatchSnapshot()
  })

  it('renders the name field with correct name props when it is required', () => {
    const { container } = renderSubmitTicketForm({ nameFieldRequired: true })

    expect(container.querySelector('input[name="name"]')).toMatchSnapshot()
  })

  it('does not render the name field with it is not enabled', () => {
    const { container } = renderSubmitTicketForm({ nameFieldEnabled: false })

    expect(container.querySelector('input[name="name"]')).not.toBeInTheDocument()
  })
})

describe('render', () => {
  it('renders scrollContainer without footer when attachments and ticket fields are false', () => {
    const { container } = renderSubmitTicketForm()

    expect(container.querySelector('footer').className).not.toContain('footerShadow')
  })

  it('renders scrollContainer with footer when attachments are true', () => {
    const { container } = renderSubmitTicketForm({
      attachmentsEnabled: true
    })

    expect(container.querySelector('footer').className).toContain('footerShadow')
  })

  it('renders scrollContainer with footer when ticket fields are true', () => {
    const { container } = renderSubmitTicketForm({
      ticketFields: [1, 2, 3]
    })

    expect(container.querySelector('footer').className).toContain('footerShadow')
  })
})
