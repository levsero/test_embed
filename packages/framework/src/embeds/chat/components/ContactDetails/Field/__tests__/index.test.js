import { render } from 'src/util/testHelpers'
import { Form } from 'react-final-form'

import ContactDetailField from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    isAuthenticated: false,
    isRequired: false,
    label: 'embeddable_framework.common.textLabel.name',
    name: 'name',
    testId: 'TEMP_TESTID',
  }

  const formValues = { name: 'boop' }

  return render(
    <Form
      initialValues={formValues}
      onSubmit={() => {}}
      render={() => <ContactDetailField {...defaultProps} {...props} />}
    />
  )
}

describe('Contact Detail Field', () => {
  it('renders the label', () => {
    const { getByText } = renderComponent()

    expect(getByText('Name')).toBeInTheDocument()
    expect(getByText('(optional)')).toBeInTheDocument()
  })

  it('contains the value of the element', () => {
    const { container } = renderComponent()

    expect(container.innerHTML).toContain('value="boop"')
  })

  it('renders the expected testId', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId('TEMP_TESTID')).toBeInTheDocument()
  })

  describe('when authenticated', () => {
    it('disables the field', () => {
      const { container } = renderComponent({ isAuthenticated: true })

      expect(container.innerHTML).toContain('disabled=""')
    })
  })

  describe('when field is required', () => {
    it(`doesn't render optional tag`, () => {
      const { queryByText } = renderComponent({ isRequired: true })

      expect(queryByText('(optional)')).toBeNull()
    })
  })

  describe('when field is not required', () => {
    it(`renders optional tag`, () => {
      const { getByText } = renderComponent({ isRequired: false })

      expect(getByText('(optional)')).toBeInTheDocument()
    })
  })
})
