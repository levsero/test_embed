import React from 'react'
import { Field } from '@zendeskgarden/react-forms'
import { render } from 'utility/testHelpers'
import ContactFormLabel from '../'

describe('ContactFormLabel', () => {
  const defaultProps = {
    value: 'A title',
    required: false,
    as: undefined
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

  it('displays the label by itself when field is read only', () => {
    const { container } = renderComponent({ value: 'A title', required: false, isReadOnly: true })

    expect(container).toHaveTextContent('A title')
    expect(container).not.toHaveTextContent('(optional)')
  })

  it('displays the label with "(optional)" when field is not required', () => {
    const { container } = renderComponent({ value: 'A title', required: false })

    expect(container).toHaveTextContent('A title (optional)')
  })

  it('supports rendering label as a different component, since Garden has different Label components for forms and dropdowns', () => {
    // eslint-disable-next-line react/prop-types
    const as = ({ dangerouslySetInnerHTML }) => (
      <div>
        Example <span dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
      </div>
    )

    const { container } = renderComponent({ value: 'A title', required: false, as })

    expect(container).toHaveTextContent('Example A title (optional)')
  })
})
