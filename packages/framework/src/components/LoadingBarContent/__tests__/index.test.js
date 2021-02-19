import { render } from '@testing-library/react'
import LoadingBarContent from '../index'

it('renders full skeleton loaders', () => {
  const { container } = render(<LoadingBarContent />)

  expect(container.firstChild).toMatchSnapshot()
})
