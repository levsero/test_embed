<<<<<<< HEAD:packages/web-widget-classic/classicSrc/__tests__/useSafeState.test.js
import { fireEvent, waitFor } from '@testing-library/dom'
import { render } from 'classicSrc/util/testHelpers'
import useSafeState from '@zendesk/widget-shared-services/hooks/useSafeState'
=======
import { fireEvent, waitFor, render } from '@testing-library/react'
import useSafeState from 'src/util/useSafeState'
>>>>>>> Move useSafeState to shared services:packages/shared-services/src/util/__tests__/useSafeState.test.js

describe('useSafeState', () => {
  // eslint-disable-next-line react/prop-types
  const ExampleComponent = ({ stateHandler, initialState, useHook = useSafeState }) => {
    const [state, setState] = useHook(initialState)

    return (
      <button
        onClick={() => {
          stateHandler(setState)
        }}
      >
        {state}
      </button>
    )
  }

  const renderComponent = (props = {}) => render(<ExampleComponent {...props} />)

  it('matches setState functionality for initial state', () => {
    const { getByText } = renderComponent({
      initialState: 'initial value',
    })

    expect(getByText('initial value')).toBeInTheDocument()
  })

  it('matches setState functionality when passing in a value to set state', () => {
    const { getByText } = renderComponent({
      initialState: 'initial value',
      stateHandler: (setState) => setState('new value'),
    })

    fireEvent.click(getByText('initial value'))

    expect(getByText('new value')).toBeInTheDocument()
  })

  it('matches setState functionality when passing in a callback to set state', async () => {
    const { getByText } = renderComponent({
      initialState: 'one',
      stateHandler: (setState) => setState((oldValue) => `${oldValue} - two`),
    })

    fireEvent.click(getByText('one'))

    await waitFor(() => expect(getByText('one - two')).toBeInTheDocument())
  })

  it('does not throw an error when setting state on an unmounted component', () => {
    const { getByText, unmount } = renderComponent({
      initialState: 'one',
      stateHandler: (setState) => setState('two'),
    })

    const button = getByText('one')

    unmount()

    fireEvent.click(button)
  })
})
