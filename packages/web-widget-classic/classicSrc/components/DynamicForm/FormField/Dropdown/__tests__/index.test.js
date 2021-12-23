import { fireEvent } from '@testing-library/dom'
import { render } from 'classicSrc/util/testHelpers'
import Dropdown from '../'

describe('Dropdown', () => {
  const defaultProps = {
    field: {
      id: '123',
      required: false,
      title: 'Some title',
      description: 'Some description',
      options: [],
    },
    value: 'Some text',
    onChange: jest.fn(),
    errorMessage: null,
  }

  const renderComponent = (props = {}, { onKeyDown = jest.fn(), ...options } = {}) =>
    render(
      <div onKeyDown={onKeyDown} role="presentation">
        <Dropdown {...defaultProps} {...props} />
      </div>,
      options
    )

  describe('when title exists', () => {
    it('displays the title', () => {
      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title: 'Some title',
          required: true,
        },
      })

      expect(queryByLabelText('Some title', { selector: 'input' })).toBeInTheDocument()
    })

    it('displays the title with optional text when not required', () => {
      const { queryByLabelText } = renderComponent({
        field: {
          ...defaultProps.field,
          title: 'Some title',
          required: false,
        },
      })

      expect(queryByLabelText('Some title (optional)', { selector: 'input' })).toBeInTheDocument()
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

  it('can mark items as disabled', () => {
    const { getByText } = renderComponent({
      field: {
        ...defaultProps.field,
        options: [
          { name: 'Not disabled', value: 'not-disabled', disabled: false },
          { name: 'Disabled', value: 'disabled', disabled: true },
        ],
      },
    })

    getByText('-').click()

    expect(getByText('Not disabled')).not.toHaveAttribute('disabled')
    expect(getByText('Disabled')).toHaveAttribute('disabled')
  })

  it('displays the error message when provided', () => {
    const { queryByRole } = renderComponent({
      errorMessage: 'Something is wrong with the input',
    })

    expect(queryByRole('alert')).toHaveTextContent('Something is wrong with the input')
  })

  it('selects a child menu item when clicked', () => {
    const onChange = jest.fn()

    const { queryByText } = renderComponent({
      field: {
        ...defaultProps.field,
        options: [
          { id: 1, name: 'parent::child1', value: '_parent__child1' },
          { id: 2, name: 'parent::child2', value: '_parent__child2' },
        ],
      },
      onChange,
    })

    queryByText('-').click()
    queryByText('parent').click()
    queryByText('child1').click()

    expect(onChange).toHaveBeenCalledWith('_parent__child1')
  })

  it('selects a grand child menu item when clicked', () => {
    const onChange = jest.fn()

    const { queryByText } = renderComponent({
      field: {
        ...defaultProps.field,
        options: [
          { id: 1, name: 'parent::child1', value: '_parent__child1' },
          { id: 2, name: 'parent::child2::grandchild1', value: '_parent__child2__grandchild1' },
          { id: 3, name: 'parent::child2::grandchild2', value: '_parent__child2__grandchild2' },
          { id: 4, name: 'child4', value: 'child4' },
        ],
      },
      onChange,
    })

    queryByText('-').click()
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
        options: [{ id: 1, name: 'parent::child1::child2', value: '_parent__child1__child2' }],
      },
      onChange,
    })

    queryByText('-').click()
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
        required: false,
        options: [{ id: 1, name: 'an_option', value: 'an_option' }],
      },
      value: 'an_option',
    })

    queryByText('an_option').click()
    expect(queryByText('-')).toBeInTheDocument()
  })

  it('continues to display an empty option at the root level when the values change if the field is not required', () => {
    const { queryByText, rerender } = renderComponent({
      field: {
        ...defaultProps.field,
        required: false,
        options: [{ id: 1, name: 'an_option', value: 'an_option' }],
      },
      value: 'an_option',
    })

    renderComponent(
      {
        field: {
          ...defaultProps.field,
          required: false,
          options: [
            { id: 1, name: 'an_option', value: 'an_option' },
            { id: 2, name: 'another_option', value: 'another_option' },
          ],
        },
        value: 'an_option',
      },
      { render: rerender }
    )

    queryByText('an_option').click()
    expect(queryByText('-')).toBeInTheDocument()
  })

  it('does not display an empty option at a nested level', () => {
    const { queryByText } = renderComponent({
      field: {
        ...defaultProps.field,
        required: false,
        options: [{ id: 1, name: 'parent::child', value: 'an_option' }],
      },
      value: 'an_option',
    })

    expect(queryByText('-')).not.toBeInTheDocument()
    queryByText('child').click()

    expect(queryByText('-')).toBeInTheDocument()
  })

  it('does not display an empty option at the root level when the field is required', () => {
    const { queryByText } = renderComponent({
      field: {
        ...defaultProps.field,
        required: true,
        options: [{ id: 1, name: 'an option', value: 'an_option' }],
      },
      value: 'an_option',
    })

    expect(queryByText('-')).toBeNull()
  })

  it('propagates escape events when closed', () => {
    const onKeyDown = jest.fn()
    const { queryByLabelText } = renderComponent(
      {
        field: {
          ...defaultProps.field,
          title: 'Some title',
          required: true,
        },
      },
      { onKeyDown }
    )

    fireEvent.keyDown(queryByLabelText('Some title', { selector: 'input' }), {
      key: 'Escape',
    })

    expect(onKeyDown).toHaveBeenCalled()
  })

  it("doesn't propagate escape events when open", () => {
    const onKeyDown = jest.fn()
    const { queryByLabelText } = renderComponent(
      {
        field: {
          ...defaultProps.field,
          title: 'Some title',
          required: true,
        },
      },
      onKeyDown
    )

    queryByLabelText('Some title', { selector: 'input' }).click()

    fireEvent.keyDown(queryByLabelText('Some title', { selector: 'input' }), {
      key: 'Escape',
    })

    expect(onKeyDown).not.toHaveBeenCalled()
  })
})
