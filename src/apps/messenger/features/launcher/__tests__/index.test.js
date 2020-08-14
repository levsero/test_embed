import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import Launcher from '../'

describe('Launcher', () => {
  const renderComponent = () => render(<Launcher />)

  it('renders an iframe', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('TODO: Launcher')).toBeInTheDocument()
  })

  it('is positioned in the bottom right of the screen', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('TODO: Launcher')).toHaveStyle(`
      bottom: 0px;
      rightL: 0px;
    `)
  })
})
