import React from 'react'
import { render } from 'utility/testHelpers'
import Dropdown from '../'

describe('Dropdown', () => {
  const defaultProps = {
    field: {
      id: '123',
      required_in_portal: false,
      title_in_portal: 'Some title',
      description: 'Some description',
      custom_field_options: []
    },
    value: 'Some text',
    onChange: jest.fn(),
    errorMessage: null
  }

  const renderComponent = (props = {}) => render(<Dropdown {...defaultProps} {...props} />)

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

  it('selects a child menu item when clicked', () => {
    const onChange = jest.fn()

    const { queryByText } = renderComponent({
      field: {
        ...defaultProps.field,
        custom_field_options: [
          { id: 1, name: 'parent::child1', value: '_parent__child1' },
          { id: 2, name: 'parent::child2', value: '_parent__child2' }
        ]
      },
      onChange
    })

    queryByText('parent').click()
    queryByText('child1').click()

    expect(onChange).toHaveBeenCalledWith('_parent__child1')
  })

  it('selects a grand child menu item when clicked', () => {
    const onChange = jest.fn()

    const { queryByText } = renderComponent({
      field: {
        ...defaultProps.field,
        custom_field_options: [
          { id: 1, name: 'parent::child1', value: '_parent__child1' },
          { id: 2, name: 'parent::child2::grandchild1', value: '_parent__child2__grandchild1' },
          { id: 3, name: 'parent::child2::grandchild2', value: '_parent__child2__grandchild2' },
          { id: 4, name: 'child4', value: 'child4' }
        ]
      },
      onChange
    })

    queryByText('parent').click()

    queryByText('child2').click()
    queryByText('grandchild2').click()

    expect(onChange).toHaveBeenCalledWith('_parent__child2__grandchild2')
  })

  it('supports nested menus', () => {
    const onChange = jest.fn()

    const { queryByText } = renderComponent({
      field: {
        ...defaultProps.field,
        custom_field_options: [
          { id: 1, name: 'parent::child1::child2', value: '_parent__child1__child2' }
        ]
      },
      onChange
    })

    queryByText('parent').click()

    // Go down a level
    queryByText('child1').click()
    expect(queryByText('child2')).toBeInTheDocument()

    // Verify top level is no longer visible
    expect(queryByText('parent')).not.toBeInTheDocument()

    // Go back up to root level
    queryByText('child1').click()
    queryByText('parent').click()

    // verify bottom level is no longer visible
    expect(queryByText('child2')).not.toBeInTheDocument()
  })

  it('displays an empty option at the root level when the field is not required', () => {
    const { queryByText } = renderComponent({
      field: {
        ...defaultProps.field,
        required_in_portal: false,
        custom_field_options: [{ id: 1, name: 'an option', value: 'an_option' }]
      },
      value: 'an_option'
    })

    expect(queryByText('-')).toBeInTheDocument()
  })

  it('displays an empty option at a nested level', () => {
    const { queryByText } = renderComponent({
      field: {
        ...defaultProps.field,
        required_in_portal: false,
        custom_field_options: [{ id: 1, name: 'parent::child', value: 'an_option' }]
      },
      value: 'an_option'
    })

    expect(queryByText('-')).toBeInTheDocument()
    queryByText('parent').click()

    expect(queryByText('-')).not.toBeInTheDocument()
  })

  it('does not display an empty option at the root level when the field is required', () => {
    const { queryByText } = renderComponent({
      field: {
        ...defaultProps.field,
        required_in_portal: false,
        custom_field_options: [{ id: 1, name: 'an option', value: 'an_option' }]
      },
      value: 'an_option'
    })

    expect(queryByText('-')).toBeInTheDocument()
  })
})
