import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import LauncherFrame from '../index'

describe('LauncherFrame', () => {
  const renderComponent = () => render(<LauncherFrame />)

  it('renders an iframe', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('TODO: Launcher')).toBeInTheDocument()
  })
})
