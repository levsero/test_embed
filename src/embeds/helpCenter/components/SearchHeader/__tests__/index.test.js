jest.mock('utility/devices')

import React from 'react'
import snapshotDiff from 'snapshot-diff'

import { render } from 'src/util/testHelpers'
import SearchHeader from '../index'
import 'jest-styled-components'

const renderComponent = inProps => {
  const props = {
    title: 'Search',
    isMobile: false,
    ...inProps
  }

  return render(<SearchHeader {...props} />)
}

it('renders correctly on desktop', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

it('renders correctly on mobile', () => {
  const { container: desktopContainer } = renderComponent()

  const { container: mobileContainer } = renderComponent({ isMobile: true })

  expect(snapshotDiff(desktopContainer, mobileContainer, { contextLines: 2 })).toMatchSnapshot()
})
