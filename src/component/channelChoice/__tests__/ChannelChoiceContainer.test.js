import React from 'react'
import { render } from '@testing-library/react'
import snapshotDiff from 'snapshot-diff'

import createStore from 'src/redux/createStore'
import { Provider } from 'react-redux'
import ChannelChoiceContainer from '../ChannelChoiceContainer'
import { TEST_IDS } from 'src/constants/shared'

describe('rendering', () => {
  const renderComponent = (props = {}) => {
    const store = createStore()
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
      <Provider store={store}>
        <ChannelChoiceContainer {...mergedProps} />
      </Provider>
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
