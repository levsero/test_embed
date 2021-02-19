import { render } from '@testing-library/react'
import NotificationContainer from '../'

const renderComponent = (override) => {
  const props = {
    className: '',
    containerClasses: '',
    showCta: true,
    leftCtaFn: () => {},
    rightCtaFn: () => {},
    leftCtaLabel: 'left label',
    rightCtaLabel: 'right label',
    rightCtaDisabled: false,
    childrenOnClick: () => {},
    children: '',
    show: true,
    transitionOnMount: false,
    onExited: () => {},
    isDismissible: true,
    onCloseIconClick: () => {},
    isMobile: false,
    useOverlay: false,
    showOnlyLeftCta: false,
    ...override,
  }

  return render(<NotificationContainer {...props} />)
}

describe('PopupContainer', () => {
  it('does not render when show is false', () => {
    const { container } = renderComponent({ show: false })

    expect(container).toMatchInlineSnapshot(`<div />`)
  })

  describe('showCta is false', () => {
    it('does not render right button', () => {
      const { queryByText } = renderComponent({ showCta: false })

      expect(queryByText('right label')).toBeNull()
      expect(queryByText('left label')).toBeNull()
    })
  })

  it('renders the right button', () => {
    const { getByText } = renderComponent()

    expect(getByText('right label')).toBeInTheDocument()
  })

  it('renders the left button', () => {
    const { getByText } = renderComponent()

    expect(getByText('left label')).toBeInTheDocument()
  })

  describe('when showOnlyLeftCta is true', () => {
    it('does not render right button', () => {
      const { queryByText } = renderComponent({ showOnlyLeftCta: true })

      expect(queryByText('right label')).toBeNull()
    })
  })
})
