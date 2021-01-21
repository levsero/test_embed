import render from 'src/utils/test/render'
import FormMessage from '../'
import { FORM_MESSAGE_STATUS } from 'src/constants'

describe('FormMessage', () => {
  const defaultProps = {
    fields: [
      {
        _id: 'id1',
        name: 'first_field',
        label: 'I am a test field',
        type: 'text'
      },
      {
        _id: 'id2',
        name: 'second_field',
        label: 'I am the second test field',
        type: 'text'
      }
    ],
    values: {}
  }

  const renderComponent = (props = {}) => render(<FormMessage {...defaultProps} {...props} />)

  it('renders the first field when the user is on the first step of the form', () => {
    const { getByText } = renderComponent()
    expect(getByText('I am a test field')).toBeInTheDocument()
  })

  it('does not render the second field when the user is on the first step of the form', () => {
    const { queryByText } = renderComponent()
    expect(queryByText('I am the second test field')).not.toBeInTheDocument()
  })

  it('renders the button with the loading spinner when for status is pending', () => {
    const { getByRole } = renderComponent({ formSubmissionStatus: FORM_MESSAGE_STATUS.pending })

    expect(getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders the button with the text "Next" when not on the final step of the form', () => {
    const { getByText } = renderComponent()
    expect(getByText('next')).toBeInTheDocument()
  })

  it('focuses on the last step visible when the form appears to the user', () => {
    const { getByLabelText } = renderComponent({ initialStep: 2, values: { id1: 'fred', id2: '' } })

    expect(getByLabelText('I am the second test field')).toHaveFocus()
  })
})
