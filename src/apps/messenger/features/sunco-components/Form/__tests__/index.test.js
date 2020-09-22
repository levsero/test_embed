import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import Form from 'src/apps/messenger/features/sunco-components/Form'

describe('Form', () => {
  const defaultProps = {
    fields: [
      {
        _id: 'afdasdfdsafdafadsfd324asd',
        name: 'first_field',
        label: 'I am a test field',
        type: 'text'
      },
      {
        _id: 'o38hadkh83hkjsdh',
        name: 'second_field',
        label: 'I am the second test field',
        type: 'text'
      }
    ],
    values: {},
    onChange: () => {},
    isFirstInGroup: true,
    status: '',
    formStatus: { failure: 'failure', pending: 'pending', success: 'success' }
  }

  const renderComponent = (props = {}) => render(<Form {...defaultProps} {...props} />)

  it('renders the first field when the user is on the first step of the form', () => {
    const { getByText } = renderComponent()
    expect(getByText('I am a test field')).toBeInTheDocument()
  })

  it('does not render the second field when the user is on the first step of the form', () => {
    const { queryByText } = renderComponent()
    expect(queryByText('I am the second test field')).not.toBeInTheDocument()
  })

  it('renders the button with the loading spinner when for status is pending', () => {
    const { getByRole } = renderComponent({ status: 'pending' })

    expect(getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders the button with the text "Next" when not on the final step of the form', () => {
    const { getByText } = renderComponent()
    expect(getByText('Next')).toBeInTheDocument()
  })

  it('focuses on the first field input when the form appears to the user', () => {
    const { getByLabelText } = renderComponent()

    expect(getByLabelText('I am a test field')).toHaveFocus()
  })
})
