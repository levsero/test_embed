import { render } from 'src/util/testHelpers'
import Checkbox from '../'

describe('Checkbox', () => {
  const defaultProps = {
    field: {
      id: '123',
      required: false,
      title: 'Some title',
      description: 'Some description',
    },
    value: 1,
    onChange: jest.fn(),
    errorMessage: null,
  }

  const renderComponent = (props = {}) => render(<Checkbox {...defaultProps} {...props} />)

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
    const { queryByText } = renderComponent({
      errorMessage: 'Something is wrong with the input',
    })

    expect(queryByText('Something is wrong with the input')).toBeInTheDocument()
  })

  describe('when value is 1', () => {
    it('displays as checked', () => {
      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title: 'Some title',
          required: true,
        },
        value: 1,
      })

      expect(queryByLabelText('Some title').checked).toBe(true)
    })

    it('calls onChange with 0 when toggled', () => {
      const onChange = jest.fn()

      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title: 'Some title',
          required: true,
        },
        value: 0,
        onChange,
      })

      const checkbox = queryByLabelText('Some title')
      checkbox.click()

      expect(onChange).toHaveBeenCalledWith(1)
    })
  })

  describe('when value is 0', () => {
    it('displays as checked', () => {
      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title: 'Some title',
          required: true,
        },
        value: 0,
      })

      expect(queryByLabelText('Some title').checked).toBe(false)
    })

    it('calls onChange with 0 when toggled', () => {
      const onChange = jest.fn()

      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title: 'Some title',
          required: true,
        },
        value: 0,
        onChange,
      })

      const checkbox = queryByLabelText('Some title')
      checkbox.click()

      expect(onChange).toHaveBeenCalledWith(1)
    })
  })
})
