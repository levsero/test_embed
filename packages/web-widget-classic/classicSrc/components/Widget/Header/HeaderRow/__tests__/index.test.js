import { render } from '@testing-library/react'
import HeaderRow from '../'

describe('HeaderRow', () => {
  const defaultProps = {
    children: <div>Some child component</div>,
  }

  const renderComponent = (props = {}) => render(<HeaderRow {...defaultProps} {...props} />)

  it('renders', () => {
    const { container } = renderComponent()

    expect(container.firstChild).toMatchSnapshot()
  })
})
