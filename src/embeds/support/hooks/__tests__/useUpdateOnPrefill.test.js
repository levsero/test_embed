import React from 'react'
import { useForm } from 'react-final-form'
import { wait } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import { handlePrefillReceived } from 'src/redux/modules/base'
import useUpdateOnPrefill from '../useUpdateOnPrefill'
import createKeyID from 'embeds/support/utils/createKeyID'

jest.mock('react-final-form')

describe('useUpdateOnPrefill', () => {
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
})
