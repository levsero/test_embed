jest.mock('utility/devices')

import React from 'react'
import { render } from '@testing-library/react'
import SuccessNotificationPage from '../'
import { isMobileBrowser } from 'utility/devices'

describe('SuccessNotificationPage', () => {
  it('renders when not on a mobile browser', () => {
    isMobileBrowser.mockReturnValue(false)

    const { container } = render(<SuccessNotificationPage />)

    expect(container).toMatchSnapshot()
  })

  it('renders when on a mobile browser', () => {
    isMobileBrowser.mockReturnValue(true)

    const { container } = render(<SuccessNotificationPage />)

    expect(container).toMatchSnapshot()
  })
})
