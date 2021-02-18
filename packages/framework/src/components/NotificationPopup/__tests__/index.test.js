import React from 'react'
import { render } from '@testing-library/react'
import NotificationPopup from '../'

const renderComponent = (override = {}, notification = {}) => {
  const props = {
    isMobile: false,
    notification: {
      avatar_path: 'regularAvatarPath',
      count: 1,
      display_name: 'taipan',
      msg: 'how are you doing',
      nick: 'agent:373116304632',
      proactive: true,
      show: true,
      title: 'does anything',
      typing: false,
      ...notification,
    },
    resultsCount: 1,
    chatNotificationDismissed: () => {},
    chatNotificationRespond: () => {},
    ...override,
  }

  return render(<NotificationPopup {...props} />)
}

describe('PopupContainer', () => {
  describe('when show is false', () => {
    it('does not render', () => {
      const { container } = renderComponent({}, { show: false })

      expect(container).toMatchInlineSnapshot(`<div />`)
    })
  })

  it('renders the agents name', () => {
    const { getByText } = renderComponent()

    expect(getByText('taipan')).toBeInTheDocument()
  })

  it('renders the agents message', () => {
    const { getByText } = renderComponent()

    expect(getByText('how are you doing')).toBeInTheDocument()
  })

  describe('avatar image', () => {
    it('renders the avatar image', () => {
      const { getByAltText } = renderComponent()

      expect(getByAltText('avatar')).toBeInTheDocument()
    })

    describe('no image path', () => {
      it('does not render the image ', () => {
        const { queryByAltText } = renderComponent({}, { avatar_path: '' })

        expect(queryByAltText('avatar')).toBeNull()
      })
    })
  })

  it('renders the dismiss button', () => {
    const { getByText } = renderComponent()

    expect(getByText('Dismiss')).toBeInTheDocument()
  })

  it('renders the reply button', () => {
    const { getByText } = renderComponent()

    expect(getByText('Reply')).toBeInTheDocument()
  })

  describe('when proactive is false', () => {
    it('does not render reply', () => {
      const { queryByText } = renderComponent({}, { proactive: false })

      expect(queryByText('Reply')).toBeNull()
    })

    it('does not render dismiss', () => {
      const { queryByText } = renderComponent({}, { proactive: false })

      expect(queryByText('Dismiss')).toBeNull()
    })
  })
})
