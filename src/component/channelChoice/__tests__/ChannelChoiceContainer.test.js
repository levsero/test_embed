import React from 'react'
import snapshotDiff from 'snapshot-diff'

import { render } from 'src/util/testHelpers'
import ChannelChoiceContainer from '../ChannelChoiceContainer'

describe('rendering', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      chatAvailable: false,
      formTitleKey: 'support',
      handleNextClick: noop,
      hideZendeskLogo: false,
      callbackEnabled: false,
      submitTicketAvailable: true,
      talkOnline: false
    }
    const mergedProps = { ...defaultProps, ...props }

    return render(<ChannelChoiceContainer {...mergedProps} />)
  }

  describe('renders ChannelChoiceContainer correctly', () => {
    it('with default props', () => {
      const { container } = renderComponent()

      expect(container).toMatchSnapshot()
    })

    it('in mobile mode', () => {
      const desktop = renderComponent()
      const { container } = renderComponent({ isMobile: true })

      expect(snapshotDiff(desktop.container, container, { contextLines: 0 })).toMatchSnapshot()
    })
  })
})
