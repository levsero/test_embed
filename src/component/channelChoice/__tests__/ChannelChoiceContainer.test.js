import React from 'react'
import { render } from '@testing-library/react'
import snapshotDiff from 'snapshot-diff'

import { ContextProvider } from 'src/util/testHelpers'
import ChannelChoiceContainer from '../ChannelChoiceContainer'
import { TEST_IDS } from 'src/constants/shared'

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

    return render(
      <ContextProvider>
        <ChannelChoiceContainer {...mergedProps} />
      </ContextProvider>
    )
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

    it('hides the logo when asked', () => {
      const { queryByTestId } = renderComponent({ hideZendeskLogo: true })

      expect(queryByTestId(TEST_IDS.ICON_ZENDESK)).not.toBeInTheDocument()
    })
  })
})
