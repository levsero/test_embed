import React from 'react'
import { render } from 'react-testing-library'
import { Component as OfflinePage } from '../index'

describe('OfflineMessage', () => {
  it('renders a label explaining that talk is offline', () => {
    const { container } = render(<OfflinePage message="Offline message" />)

    expect(container).toMatchSnapshot()
  })
})
