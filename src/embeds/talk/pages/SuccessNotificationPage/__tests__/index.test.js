jest.mock('utility/devices')

import React from 'react'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'
import { render } from '@testing-library/react'
import SuccessNotificationPage from '../'
import { isMobileBrowser } from 'utility/devices'

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
    isMobileBrowser.mockReturnValue(true)

    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })
})
