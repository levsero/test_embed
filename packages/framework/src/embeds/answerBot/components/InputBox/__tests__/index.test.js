import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import InputBox from '../index'

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

test('renders the expected elements', () => {
  const { queryByPlaceholderText, queryByLabelText } = renderComponent()

  expect(queryByLabelText('placeholder')).toBeInTheDocument()
  expect(queryByPlaceholderText('placeholder')).toBeInTheDocument()
})

test('text area has 3 rows when in desktop', () => {
  const { getByPlaceholderText } = renderComponent()

  expect(getByPlaceholderText('placeholder').rows).toEqual(3)
})

test('text area has 1 row when in mobile', () => {
  const { getByPlaceholderText } = renderComponent({ isMobile: true })

  expect(getByPlaceholderText('placeholder').rows).toEqual(1)
})

test('renders with value', () => {
  const { getByPlaceholderText } = renderComponent({
    inputValue: 'doremi'
  })

  expect(getByPlaceholderText('placeholder').value).toEqual('doremi')
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
