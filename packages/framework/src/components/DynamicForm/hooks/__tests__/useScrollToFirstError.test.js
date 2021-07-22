import { fireEvent } from '@testing-library/react'
import { FORM_ERROR } from 'final-form'
import { render } from 'src/util/testHelpers'
import useScrollToFirstError from '../useScrollToFirstError'

jest.mock('react-final-form')
jest.mock('embeds/support/utils/getFields')

describe('useScrollToFirstError', () => {
  // eslint-disable-next-line react/prop-types
  const ExampleComponent = ({ fields, errors }) => {
    const scrollToFirstError = useScrollToFirstError()

    return (
      <button
        data-testid="container"
        style={{ height: 50, overflowY: 'scroll' }}
        onClick={() => {
          scrollToFirstError(fields, errors)
        }}
      >
        {fields.map((field) => (
          <>
            <label data-fieldid={field.id}>{field.id}</label>
            <input style={{ height: 50 }} key={field.id} data-testid={field.id} name={field.id} />
          </>
        ))}

        <div style={{ height: 50 }} data-testid={FORM_ERROR} data-fieldid={FORM_ERROR} />
      </button>
    )
  }

  const defaultProps = {
    fields: [{ id: 'one' }, { id: 'two' }, { id: 'three' }],
    errors: {},
  }

  const renderComponent = (props = {}) => {
    return render(<ExampleComponent {...defaultProps} {...props} />)
  }

  it('scrolls to the first field that has an error', () => {
    let elementScrolledIntoView = null

    window.HTMLElement.prototype.scrollIntoView = jest.fn(function () {
      elementScrolledIntoView = this
    })

    const errors = { two: 'Some error' }

    const { container, queryByTestId } = renderComponent({ errors })

    fireEvent.click(queryByTestId('container'))

    expect(elementScrolledIntoView).toBe(container.querySelector('[data-fieldid="two"]'))
  })

  it('focuses the first field that has an error', () => {
    const errors = { two: 'Some error' }

    const { queryByTestId } = renderComponent({ errors })

    fireEvent.click(queryByTestId('container'))

    expect(queryByTestId('two')).toHaveFocus()
  })

  it('scrolls to the form error message if it is the only error', () => {
    let elementScrolledIntoView = null

    window.HTMLElement.prototype.scrollIntoView = jest.fn(function () {
      elementScrolledIntoView = this
    })

    const errors = { [FORM_ERROR]: 'Some error' }

    const { queryByTestId } = renderComponent({ errors })

    fireEvent.click(queryByTestId('container'))

    expect(elementScrolledIntoView).toBe(queryByTestId(FORM_ERROR))
  })
})
