import { fireEvent } from '@testing-library/react'
import React from 'react'

import { render } from 'src/util/testHelpers'
import { Component as SearchField } from '../index'
import { TEST_IDS } from 'src/constants/shared'

jest.useFakeTimers()

const onChangeSpy = jest.fn()
const renderComponent = (props) => {
  const defaultProps = {
    onChange: onChangeSpy,
    isLoading: false,
    placeholder: 'hello there',
    value: '',
    inputRef: {},
  }

  return render(<SearchField {...defaultProps} {...props} />)
}

test('renders', () => {
  expect(renderComponent().container).toMatchSnapshot()
})

test('it renders the loading dots when loading', () => {
  const { getByTestId } = renderComponent({ isLoading: true })

  jest.advanceTimersByTime(1000) // loading dots appear after a delay

  expect(getByTestId(TEST_IDS.ICON_ELLIPSIS)).toBeInTheDocument()
})

describe('clear input close icon', () => {
  describe('with no input', () => {
    it('does not render', () => {
      const { queryByTestId } = renderComponent()

      expect(queryByTestId(TEST_IDS.ICON_CLEAR_INPUT)).not.toBeInTheDocument()
    })
  })

  describe('with input', () => {
    it('renders', () => {
      const { getByTestId } = renderComponent({ value: 'help' })

      expect(getByTestId(TEST_IDS.ICON_CLEAR_INPUT)).toBeInTheDocument()
    })

    it('calls onChange with no argument when clicked', () => {
      const { getByTestId } = renderComponent({ value: 'help' })

      fireEvent.click(getByTestId(TEST_IDS.ICON_CLEAR_INPUT))

      expect(onChangeSpy).toHaveBeenCalledWith()
    })
  })
})

test('renders with value', () => {
  const { getByPlaceholderText } = renderComponent({ value: 'blah' })

  expect(getByPlaceholderText('hello there').value).toEqual('blah')
})

test('onChange handler', () => {
  const { getByPlaceholderText } = renderComponent()

  fireEvent.change(getByPlaceholderText('hello there'), { target: { value: 'tsk' } })

  expect(onChangeSpy).toHaveBeenCalledWith('tsk')
})
