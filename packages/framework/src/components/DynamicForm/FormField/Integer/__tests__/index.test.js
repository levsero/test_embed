import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import Integer from '../'

describe('Integer', () => {
  const defaultProps = {
    field: {
      id: '123',
      required: false,
      title: 'Some title',
      description: 'Some description',
    },
    value: '123',
    onChange: jest.fn(),
    errorMessage: null,
  }

  const renderComponent = (props = {}) => render(<Integer {...defaultProps} {...props} />)

  describe('when title exists', () => {
    it('displays the title', () => {
      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title: 'Some title',
          required: true,
        },
      })

      expect(queryByLabelText('Some title')).toBeInTheDocument()
    })

    it('displays the title with optional text when not required', () => {
      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title: 'Some title',
          required: false,
        },
      })

      expect(queryByLabelText('Some title (optional)')).toBeInTheDocument()
    })
  })

  it('does not display a label when title does not exist', () => {
    const { container } = renderComponent({
      field: {
        ...defaultProps.field,
        title: null,
      },
    })

    expect(container.querySelector('label')).toBeNull()
  })

  it('displays the fields description', () => {
    const { queryByText } = renderComponent({
      field: {
        ...defaultProps.field,
        description: 'Some description',
      },
    })

    expect(queryByText('Some description')).toBeInTheDocument()
  })

  it('displays the error message when provided', () => {
    const { queryByRole } = renderComponent({
      errorMessage: 'Something is wrong with the input',
    })

    expect(queryByRole('alert')).toHaveTextContent('Something is wrong with the input')
  })

  it('displays the current value', () => {
    const { queryByLabelText } = renderComponent({
      field: {
        ...defaultProps.field,
        title: 'Some title',
        required: true,
      },
      value: '123',
    })

    expect(queryByLabelText('Some title').value).toBe('123')
  })

  it('calls onChange when changed', () => {
    const onChange = jest.fn()

    const { queryByLabelText } = renderComponent({
      field: {
        ...defaultProps.field,
        title: 'Some title',
        required: true,
      },
      value: '123',
      onChange,
    })

    const input = queryByLabelText('Some title')
    fireEvent.change(input, { target: { value: '1337' } })

    expect(onChange).toHaveBeenCalledWith('1337')
  })

  it('does not allow you to enter decimals', () => {
    const onChange = jest.fn()

    const { queryByLabelText } = renderComponent({
      field: {
        ...defaultProps.field,
        title: 'Some title',
        required: true,
      },
      value: '123',
      onChange,
    })

    const input = queryByLabelText('Some title')
    fireEvent.change(input, { target: { value: '13.37' } })

    expect(onChange).toHaveBeenCalledWith('1337')
  })
})
