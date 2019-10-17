jest.mock('utility/devices')

import React from 'react'
import { render } from '@testing-library/react'
import snapshotDiff from 'snapshot-diff'

import { ContextProvider } from 'src/util/testHelpers'
import SearchHeader from '../index'
import 'jest-styled-components'

const renderComponent = inProps => {
  const props = {
    children: 'Search',
    isMobile: false,
    ...inProps
  }

  return render(
    <ContextProvider>
      <SearchHeader {...props} />
    </ContextProvider>
  )
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
