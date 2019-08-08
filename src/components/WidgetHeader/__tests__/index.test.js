jest.mock('utility/devices')

import React from 'react'
import { render } from '@testing-library/react'
import snapshotDiff from 'snapshot-diff'
import { isMobileBrowser } from 'utility/devices'
import WidgetHeader from '../index'

describe('WidgetHeader', () => {
  const defaultProps = {
    children: 'Hallo'
  }

  const renderComponent = modifiedProps => {
    const props = {
      ...defaultProps,
      ...modifiedProps
    }

    return render(<WidgetHeader {...props} />)
  }

  it('renders on desktop browsers', () => {
    isMobileBrowser.mockReturnValue(false)
    const { container } = renderComponent()

    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders on mobile browsers', () => {
    isMobileBrowser.mockReturnValue(false)
    const { container: desktopContainer } = renderComponent()

    isMobileBrowser.mockReturnValue(true)
    const { container: mobileContainer } = renderComponent()

    expect(
      snapshotDiff(desktopContainer.firstChild, mobileContainer.firstChild, { contextLines: 2 })
    ).toMatchSnapshot()
  })
})
