jest.mock('utility/devices')

import React from 'react'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import snapshotDiff from 'snapshot-diff'

import createStore from 'src/redux/createStore'
import { isMobileBrowser } from 'utility/devices'
import SuccessNotificationPage from '../'

const defaultProps = {
  title: 'Request sent'
}

const renderComponent = (props = {}) => {
  return render(
    <Provider store={createStore()}>
      <SuccessNotificationPage {...defaultProps} {...props} />
    </Provider>
  )
}

describe('SuccessNotificationPage', () => {
  it('renders when not on a mobile browser', () => {
    isMobileBrowser.mockReturnValue(false)

    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('renders when on a mobile browser', () => {
    isMobileBrowser.mockReturnValue(false)
    const { container: desktopContainer } = renderComponent()

    isMobileBrowser.mockReturnValue(true)

    const { container: mobileContainer } = renderComponent()

    expect(snapshotDiff(desktopContainer, mobileContainer, { contextLines: 2 })).toMatchSnapshot()
  })
})
