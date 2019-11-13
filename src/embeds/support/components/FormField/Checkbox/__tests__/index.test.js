import React from 'react'
import { render } from 'utility/testHelpers'
import Checkbox from '../'

describe('Checkbox', () => {
  const defaultProps = {
    field: {
      id: '123',
      required_in_portal: false,
      title_in_portal: 'Some title',
      description: 'Some description'
    },
    value: 1,
    onChange: jest.fn(),
    errorMessage: null
  }

  const renderComponent = (props = {}) => render(<Checkbox {...defaultProps} {...props} />)

  describe('when title exists', () => {
    it('displays the title', () => {
      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title_in_portal: 'Some title',
          required_in_portal: true
        }
      })

      expect(queryByLabelText('Some title')).toBeInTheDocument()
    })

    it('displays the title with optional text when not required', () => {
      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title_in_portal: 'Some title',
          required_in_portal: false
        }
      })

      expect(queryByLabelText('Some title (optional)')).toBeInTheDocument()
    })
  })

  it('does not display a label when title does not exist', () => {
    const { container } = renderComponent({
      field: {
        ...defaultProps.field,
        title_in_portal: null
      }
    })

    expect(container.querySelector('label')).toBeNull()
  })

  it('displays the fields description', () => {
    const { queryByText } = renderComponent({
      field: {
        ...defaultProps.field,
        description: 'Some description'
      }
    })

    expect(queryByText('Some description')).toBeInTheDocument()
  })

  it('displays the error message when provided', () => {
    const { queryByRole } = renderComponent({
      errorMessage: 'Something is wrong with the input'
    })

    expect(queryByRole('alert')).toHaveTextContent('Something is wrong with the input')
  })

  describe('when value is 1', () => {
    it('displays as checked', () => {
      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title_in_portal: 'Some title',
          required_in_portal: true
        },
        value: 1
      })

      expect(queryByLabelText('Some title').checked).toBe(true)
    })

    it('calls onChange with 0 when toggled', () => {
      const onChange = jest.fn()

      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title_in_portal: 'Some title',
          required_in_portal: true
        },
        value: 0,
        onChange
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
          title_in_portal: 'Some title',
          required_in_portal: true
        },
        value: 0
      })

      expect(queryByLabelText('Some title').checked).toBe(false)
    })

    it('calls onChange with 0 when toggled', () => {
      const onChange = jest.fn()

      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title_in_portal: 'Some title',
          required_in_portal: true
        },
        value: 0,
        onChange
      })

      const checkbox = queryByLabelText('Some title')
      checkbox.click()

      expect(onChange).toHaveBeenCalledWith(1)
    })
  })
})
