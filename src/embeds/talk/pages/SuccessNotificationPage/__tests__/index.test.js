jest.mock('utility/devices')

import React from 'react'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'

import createStore from 'src/redux/createStore'
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
  it('renders', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })
})
