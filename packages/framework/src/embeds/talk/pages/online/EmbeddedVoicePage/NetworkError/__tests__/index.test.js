import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { render } from 'src/util/testHelpers'
import NetworkError from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    onClick: jest.fn(),
  }
  return render(<NetworkError {...defaultProps} {...props} />)
}

describe('NetworkError', () => {
  it('renders the title', () => {
    renderComponent()

    expect(screen.getByText("Call couldn't be connected")).toBeInTheDocument()
  })

  it('renders the message', () => {
    renderComponent()

    expect(screen.getByText('Check your internet connection and try again.')).toBeInTheDocument()
  })

  it('renders a button to Try again', () => {
    renderComponent()

    expect(screen.getByText('Try again')).toBeInTheDocument()
  })

  it('fires the onClick event when the Try again button is clicked', () => {
    const onClick = jest.fn()
    renderComponent({ onClick })

    userEvent.click(screen.getByText('Try again'))

    expect(onClick).toHaveBeenCalled()
  })
})
