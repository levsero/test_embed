import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import createStore from 'src/apps/messenger/store'
import { widgetOpened } from 'src/apps/messenger/store/visibility'
import App from '../'

describe('Messenger app', () => {
  let store
  const renderComponent = (actions = []) => {
    store = createStore()

    actions.forEach(action => {
      store.dispatch(action())
    })

    return render(<App />, { store })
  }

  beforeEach(() => {})
  it('renders the launcher', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('TODO: Launcher')).toBeInTheDocument()
  })

  it('does not render the messenger when not messenger is open', () => {
    const { queryByTitle } = renderComponent()

    expect(queryByTitle('TODO: Messenger')).not.toBeInTheDocument()
  })

  it('renders the messenger when messenger is open', () => {
    const { getByTitle } = renderComponent([widgetOpened])

    expect(getByTitle('TODO: Messenger')).toBeInTheDocument()
  })
})
