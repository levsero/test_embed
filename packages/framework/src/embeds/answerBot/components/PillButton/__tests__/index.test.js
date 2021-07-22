import { render } from '@testing-library/react'
import PillButton from '../index'

test('renders the element', () => {
  const { queryByText } = render(<PillButton label="hello world" />)

  expect(queryByText('hello world').type).toEqual('button')
})

test('allows custom classes', () => {
  const { queryByText } = render(<PillButton label="custom class" className="blah" />)

  expect(queryByText('custom class').className).toContain('blah')
})
