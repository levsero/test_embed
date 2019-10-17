jest.mock('utility/devices')

import React from 'react'
import { render } from '@testing-library/react'
import { ContextProvider } from 'src/util/testHelpers'

import SuccessNotificationPage from '../'

const defaultProps = {
  title: 'Request sent'
}

const renderComponent = (props = {}) => {
  return render(
    <ContextProvider>
      <SuccessNotificationPage {...defaultProps} {...props} />
    </ContextProvider>
  )
}

describe('SuccessNotificationPage', () => {
  it('renders', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })
})
