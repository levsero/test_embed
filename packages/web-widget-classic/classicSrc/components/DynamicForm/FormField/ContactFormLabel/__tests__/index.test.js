import { render } from 'classicSrc/util/testHelpers'
import { Field } from '@zendeskgarden/react-forms'
import ContactFormLabel from '../'

describe('ContactFormLabel', () => {
  const defaultProps = {
    value: 'A title',
    required: false,
    as: undefined,
    isReadOnly: false,
    isPreview: false,
  }

  const renderComponent = (props = {}) =>
    render(
      <Field>
        <ContactFormLabel {...defaultProps} {...props} />
      </Field>
    )

  it('displays the label by itself when field is required', () => {
    const { container } = renderComponent({ value: 'A title', required: true })

    expect(container).toHaveTextContent('A title')
    expect(container).not.toHaveTextContent('(optional)')
  })

  it('displays the label with "(optional)" when field is not required', () => {
    const { container } = renderComponent({ value: 'A title', required: false })

    expect(container).toHaveTextContent('A title (optional)')
  })

  it('does not display "(optional)" if the field is read only', () => {
    const { container } = renderComponent({ value: 'A title', required: false, isReadOnly: true })

    expect(container).not.toHaveTextContent('(optional)')
  })

  it('displays the label with "(optional)" when field is not required, readonly and in preview mode', () => {
    const { container } = renderComponent({
      value: 'A title',
      required: false,
      isReadOnly: true,
      isPreview: true,
    })

    expect(container).toHaveTextContent('A title (optional)')
  })

  it('supports rendering label as a different component, since Garden has different Label components for forms and dropdowns', () => {
    // eslint-disable-next-line react/prop-types
    const as = ({ children }) => <div>Example {children}</div>

    const { container } = renderComponent({ value: 'A title', required: false, as })
    expect(container).toHaveTextContent('Example A title (optional)')
  })
})
