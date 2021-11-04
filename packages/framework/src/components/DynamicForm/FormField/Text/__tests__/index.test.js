import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import Text from '../'

describe('Text', () => {
  const defaultProps = {
    field: {
      id: '123',
      required: false,
      title: 'Some title',
      description: 'Some description',
    },
    value: 'Some text',
    onChange: jest.fn(),
    errorMessage: null,
  }

  const renderComponent = (props = {}) => render(<Text {...defaultProps} {...props} />)

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
      value: 'Some text',
    })

    expect(queryByLabelText('Some title').value).toBe('Some text')
  })

  it('calls onChange when changed', () => {
    const onChange = jest.fn()

    const { queryByLabelText } = renderComponent({
      field: {
        ...defaultProps.field,
        title: 'Some title',
        required: true,
      },
      value: 'Some text',
      onChange,
    })

    const input = queryByLabelText('Some title')
    fireEvent.change(input, { target: { value: 'New value' } })

    expect(onChange).toHaveBeenCalledWith('New value')
  })

  it('sets self as email type when the field type is email', () => {
    const { queryByLabelText } = renderComponent({
      field: {
        ...defaultProps.field,
        title: 'Email',
        required: true,
        type: 'email',
      },
      value: 'some@email.com',
    })

    expect(queryByLabelText('Email')).toHaveAttribute('type', 'email')
  })

  it('does not set self as email when type is text', () => {
    const { queryByLabelText } = renderComponent({
      field: {
        ...defaultProps.field,
        title: 'Email',
        required: true,
        type: 'text',
      },
      value: 'some@email.com',
    })

    expect(queryByLabelText('Email')).toHaveAttribute('type', 'text')
  })
})
