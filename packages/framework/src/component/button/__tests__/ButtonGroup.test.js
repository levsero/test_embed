import { render } from '@testing-library/react'
import { ButtonGroup } from '../ButtonGroup'

test('renders the expected classes', () => {
  const { container } = render(<ButtonGroup>hmmm</ButtonGroup>)

  expect(container).toMatchSnapshot()
})

test('renders the expected rtl classes', () => {
  const { container } = render(<ButtonGroup rtl={true}>rtl test</ButtonGroup>)

  expect(container).toMatchSnapshot()
})
