import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import Messenger from '../'

describe('Messenger', () => {
  const renderComponent = () => render(<Messenger />)

  it('renders an iframe', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('TODO: Messenger')).toBeInTheDocument()
  })

  it('is positioned in the bottom right of the screen above the launcher', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('TODO: Messenger')).toHaveStyle(`
      bottom: 90px;
      rightL: 0px;
    `)
  })
})
