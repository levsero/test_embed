jest.mock('utility/devices')

import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import snapshotDiff from 'snapshot-diff'
import createStore from 'src/redux/createStore'
import SearchHeader from '../index'

const renderComponent = inProps => {
  const props = {
    children: 'Search',
    isMobile: false,
    ...inProps
  }

  return render(
    <Provider store={createStore()}>
      <SearchHeader {...props} />
    </Provider>
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
