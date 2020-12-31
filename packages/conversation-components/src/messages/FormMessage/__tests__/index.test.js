import render from 'src/utils/test/render'
import FormMessage from '../FormMessage'
import { FORM_MESSAGE_STATUS } from 'src/constants'

describe('FormMessage', () => {
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
    status: 'unsubmitted',
    errors: {},
    activeStep: 2
  }

  const renderComponent = (props = {}) => render(<FormMessage {...defaultProps} {...props} />)

  it('renders the first field when the user is on the first step of the form', () => {
    const { getByText } = renderComponent()
    expect(getByText('I am a test field')).toBeInTheDocument()
  })

  it('does not render the second field when the user is on the first step of the form', () => {
    const { queryByText } = renderComponent({ activeStep: 1 })
    expect(queryByText('I am the second test field')).not.toBeInTheDocument()
  })

  it('renders the button with the loading spinner when for status is pending', () => {
    const { getByRole } = renderComponent({ status: FORM_MESSAGE_STATUS.pending })

    expect(getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders the button with the text "Next" when not on the final step of the form', () => {
    const { getByText } = renderComponent({ activeStep: 1 })
    expect(getByText('Next')).toBeInTheDocument()
  })

  it('focuses on the last step visible when the form appears to the user', () => {
    const { getByLabelText } = renderComponent({ activeStep: 2 })

    expect(getByLabelText('I am the second test field')).toHaveFocus()
  })
})
