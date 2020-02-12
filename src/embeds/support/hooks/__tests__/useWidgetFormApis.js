import React from 'react'
import { useForm } from 'react-final-form'
import { wait } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import { apiClearForm, handlePrefillReceived } from 'src/redux/modules/base'
import useWidgetFormApis from '../useWidgetFormApis'
import createKeyID from 'embeds/support/utils/createKeyID'

jest.mock('react-final-form')

describe('useWidgetFormApis', () => {
  const ExampleComponent = () => {
    useWidgetFormApis()
    return null
  }

  const renderComponent = (props = {}, options) => render(<ExampleComponent {...props} />, options)

  let mockChange
  let mockReset

  beforeEach(() => {
    mockChange = jest.fn()
    mockReset = jest.fn()

    useForm.mockReturnValue({
      batch: cb => {
        cb()
      },
      change: mockChange,
      reset: mockReset
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

    await wait(() => expect(mockChange).toHaveBeenCalledWith(createKeyID('name'), 'Some name'))

    store.dispatch(
      handlePrefillReceived({
        name: {
          value: 'Another name'
        }
      })
    )

    await wait(() => expect(mockChange).toHaveBeenCalledWith(createKeyID('name'), 'Another name'))
  })

  it('resets the form when the clear api is called', async () => {
    const { store } = renderComponent()

    store.dispatch(apiClearForm())

    await wait(() => expect(mockReset).toHaveBeenCalledWith({}))
  })
})
