import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import Messenger from '../'
import {
  frameMarginFromPage,
  launcherSize,
  marginBetweenFrames
} from 'src/apps/messenger/constants'

describe('Messenger', () => {
  const renderComponent = () => render(<Messenger />)

  it('renders an iframe', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('Messenger')).toBeInTheDocument()
  })

  it('is positioned in the bottom right of the screen above the launcher', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('Messenger')).toHaveStyle(`
      bottom: ${launcherSize + frameMarginFromPage + marginBetweenFrames};
      right: ${frameMarginFromPage};
    `)
  })
})
