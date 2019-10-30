import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import snapshotDiff from 'snapshot-diff'
import SearchField from '../index'

const renderComponent = props => {
  const mergedProps = {
    searchPlaceholder: 'hello there',
    ...props
  }
  return render(<SearchField {...mergedProps} />)
}

test('renders expected classes', () => {
  expect(renderComponent().container).toMatchSnapshot()
})

test('renders expected classes for mobile', () => {
  const field = renderComponent(),
    mobileField = renderComponent({ isMobile: true })
  expect(
    snapshotDiff(field.container, mobileField.container, { contextLines: 2 })
  ).toMatchSnapshot()
})

test('renders loading classes', () => {
  const field = renderComponent(),
    loadingField = renderComponent({ isLoading: true })
  expect(
    snapshotDiff(field.container, loadingField.container, { contextLines: 2 })
  ).toMatchSnapshot()
})

test('renders loading classes in mobile', () => {
  const field = renderComponent(),
    loadingField = renderComponent({ isLoading: true })
  expect(
    snapshotDiff(field.container, loadingField.container, { contextLines: 2 })
  ).toMatchSnapshot()
})

test('renders with value', () => {
  const { getByPlaceholderText } = renderComponent({ value: 'blah' })
  expect(getByPlaceholderText('hello there').value).toEqual('blah')
})

test('onChange handler', () => {
  const onChangeValue = jest.fn()
  const { getByPlaceholderText } = renderComponent({ onChangeValue })
  fireEvent.change(getByPlaceholderText('hello there'), { target: { value: 'tsk' } })
  expect(onChangeValue).toHaveBeenCalledWith('tsk')
})
