import React from 'react'
import { render } from '@testing-library/react'

import { ContextProvider } from 'src/util/testHelpers'
import { Component as OfflinePage } from '../index'

describe('OfflineMessage', () => {
  it('renders a label explaining that talk is offline', () => {
    const { container } = render(
      <ContextProvider>
        <OfflinePage message="Offline message" title={'title'} hideZendeskLogo={false} />
      </ContextProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
