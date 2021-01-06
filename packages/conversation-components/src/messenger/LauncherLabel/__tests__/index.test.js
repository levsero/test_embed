import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/dom'
import render from 'src/utils/test/render'

import LauncherLabel from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    closeButtonAriaLabel: 'Close',
    onCloseClick: jest.fn(),
    onLabelClick: jest.fn(),
    position: 'left',
    text: 'Launcher label',
  }

  return render(<LauncherLabel {...defaultProps} {...props} />)
}

describe('LauncherLabel', () => {
  it('renders the given text', () => {
    renderComponent()

    expect(screen.getByText('Launcher label')).toBeInTheDocument()
  })

  it('gives the close button the given aria label', () => {
    renderComponent()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('fires onCloseClick on close button click', () => {
    const onCloseClick = jest.fn()
    renderComponent({ onCloseClick })

    userEvent.click(screen.getByRole('button', { name: 'Close' }))

    expect(onCloseClick).toHaveBeenCalled()
  })

  it('fires onLabelClick on label click', () => {
    const onLabelClick = jest.fn()
    renderComponent({ onLabelClick })

    userEvent.click(screen.getByText('Launcher label'))

    expect(onLabelClick).toHaveBeenCalled()
  })
})
