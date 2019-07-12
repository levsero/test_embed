import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import { InputBox } from '../index'

const renderComponent = (props = {}) => {
  const defaultProps = {
    name: 'inputBox',
    placeholder: 'placeholder',
    handleSendInputValue: noop
  }

  const componentProps = {
    ...defaultProps,
    ...props
  }

  return render(<InputBox {...componentProps} />)
}

test('renders the expected classes', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

test('renders as disabled', () => {
  const { container } = renderComponent({
    disabled: true
  })

  expect(container).toMatchSnapshot()
})

test('renders as mobile', () => {
  const { container } = renderComponent({
    isMobile: true
  })

  expect(container).toMatchSnapshot()
})

test('renders with value', () => {
  const { container } = renderComponent({
    inputValue: 'doremi'
  })

  expect(container).toMatchSnapshot()
})

describe('events', () => {
  it('updates handler on change', () => {
    const handler = jest.fn()
    const { getByPlaceholderText } = renderComponent({
      updateInputValue: handler,
      placeholder: 'here'
    })

    fireEvent.change(getByPlaceholderText('here'), { target: { value: 'new' } })
    expect(handler).toHaveBeenCalledWith('new')
  })

  it('updates handler on enter key event', () => {
    const handler = jest.fn()
    const { getByPlaceholderText } = renderComponent({
      handleSendInputValue: handler,
      placeholder: 'here'
    })

    fireEvent.keyDown(getByPlaceholderText('here'), {
      key: 'Enter',
      keyCode: 13,
      which: 13
    })
    expect(handler).toHaveBeenCalled()
  })

  it('does not update handler on enter key event when shift key is pressed', () => {
    const handler = jest.fn()
    const { getByPlaceholderText } = renderComponent({
      handleSendInputValue: handler,
      placeholder: 'here'
    })

    fireEvent.keyDown(getByPlaceholderText('here'), {
      key: 'Enter',
      keyCode: 13,
      which: 13,
      shiftKey: true
    })
    expect(handler).not.toHaveBeenCalled()
  })
})
