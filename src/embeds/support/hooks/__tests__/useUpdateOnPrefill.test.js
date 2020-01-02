import React from 'react'
import { useForm } from 'react-final-form'
import { render } from 'src/util/testHelpers'
import { handlePrefillReceived } from 'src/redux/modules/base'
import wait from 'utility/wait'
import createStore from 'src/redux/createStore'
import useUpdateOnPrefill from '../useUpdateOnPrefill'

jest.mock('react-final-form')

describe('useOnPrefill', () => {
  const ExampleComponent = () => {
    useUpdateOnPrefill()
    return null
  }

  const renderComponent = (props = {}, options) => render(<ExampleComponent {...props} />, options)

  let mockChange

  beforeEach(() => {
    mockChange = jest.fn()
    useForm.mockReturnValue({
      batch: cb => {
        cb()
      },
      change: mockChange
    })
  })

  it('updates the form when the user has called the prefill api', async () => {
    const { store } = renderComponent()

    store.dispatch(
      handlePrefillReceived({
        name: {
          value: 'Some name'
        }
      })
    )

    await wait()

    expect(mockChange).toHaveBeenCalledWith('name', 'Some name')
  })

  it('does not update the form on first render', async () => {
    const store = createStore()

    store.dispatch(
      handlePrefillReceived({
        name: {
          value: 'Some name'
        }
      })
    )

    renderComponent(undefined, { store })

    expect(mockChange).not.toHaveBeenCalled()

    store.dispatch(
      handlePrefillReceived({
        name: {
          value: 'A new name'
        }
      })
    )

    await wait()

    expect(mockChange).toHaveBeenCalledWith('name', 'A new name')
  })
})
