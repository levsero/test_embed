import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import createStore from 'src/redux/createStore'
import { Component as OfflinePage } from '../index'

describe('OfflineMessage', () => {
  it('renders a label explaining that talk is offline', () => {
    const { container } = render(
      <Provider store={createStore()}>
        <OfflinePage message="Offline message" title={'title'} hideZendeskLogo={false} />
      </Provider>
    )

    expect(container).toMatchSnapshot()
  })
})
