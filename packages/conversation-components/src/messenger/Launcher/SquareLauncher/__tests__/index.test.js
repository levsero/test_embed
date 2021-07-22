import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { find } from 'styled-components/test-utils'
import render from 'src/utils/test/render'
import { MessengerIcon, CloseIcon } from '../LauncherIcon/styles'
import SquareLauncher from '../index'

const renderComponent = (props = {}) => {
  return render(<SquareLauncher {...props} />)
}

describe('SquareLauncher', () => {
  it('initially renders the Open icon', () => {
    const { container } = renderComponent()

    expect(find(container, MessengerIcon)).toBeInTheDocument()
  })

  it('renders the close icon when the widget is open', () => {
    const { container } = renderComponent()

    userEvent.click(find(container, MessengerIcon))

    expect(find(container, CloseIcon)).toBeInTheDocument()
  })

  it('renders a box shadow on hover', () => {
    renderComponent()

    userEvent.hover(screen.getByRole('button'))

    expect(screen.getByRole('button')).toHaveStyleRule(`
    background-color: #17494D !important;
    color: #17494D !important;
    box-shadow: -4px 0px 20px 0px rgba(36,36,36,0.2);`)
  })
})
