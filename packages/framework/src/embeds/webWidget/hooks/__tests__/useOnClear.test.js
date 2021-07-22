import { wait } from '@testing-library/react'
import useOnClear from 'src/embeds/webWidget/hooks/useOnClear'
import { apiClearForm } from 'src/redux/modules/base'
import { render } from 'src/util/testHelpers'

describe('useOnClear', () => {
  const ExampleComponent = ({ callback }) => {
    useOnClear(callback)

    return null
  }

  const renderComponent = (props = {}) => render(<ExampleComponent {...props} />)

  it('calls the callback when the clear api is called', async () => {
    const callback = jest.fn()

    const { store } = renderComponent({ callback })

    expect(callback).not.toHaveBeenCalled()

    store.dispatch(apiClearForm())

    await wait(() => expect(callback).toHaveBeenCalled())
  })
})
