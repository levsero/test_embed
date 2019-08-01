import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Component as OfflinePage } from '../index'
import createStore from 'src/redux/createStore'

describe('OfflineMessage', () => {
  it('renders a label explaining that talk is offline', () => {
    const { container } = render(
      <Provider store={createStore()}>
        <OfflinePage message="Offline message" />
      </Provider>
    )

    expect(container).toMatchSnapshot()
  })
})
