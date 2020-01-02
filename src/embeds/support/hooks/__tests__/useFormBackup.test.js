import React from 'react'
import { render } from 'utility/testHelpers'
import useFormBackup from '../useFormBackup'
import { useForm } from 'react-final-form'
import { setFormState } from 'embeds/support/actions'
import wait from 'utility/wait'
import createStore from 'src/redux/createStore'

jest.mock('react-final-form')

describe('useFormBackup', () => {
  const ExampleComponent = ({ formName }) => {
    useFormBackup(formName)
    return null
  }

  const defaultProps = {
    formName: 'form name'
  }

  const renderComponent = (props = {}, options) =>
    render(<ExampleComponent {...defaultProps} {...props} />, options)

  beforeEach(() => {
    const thing = {
      getState: () => ({
        values: {
          name: 'Some name'
        }
      })
    }

    useForm.mockReturnValue(thing)
  })

  it('saves the form state to redux when the form changes', async () => {
    const store = createStore()
    const dispatchSpy = jest.spyOn(store, 'dispatch')

    const { rerender } = renderComponent({ formName: 'form name' }, { store })

    expect(dispatchSpy).not.toHaveBeenCalled()

    renderComponent({ formName: 'another form' }, { render: rerender, store })

    await wait()

    expect(dispatchSpy).toHaveBeenCalledWith(setFormState('form name', { name: 'Some name' }))
  })

  it('saves the form state to redux when the form unmounts', () => {
    const store = createStore()
    const dispatchSpy = jest.spyOn(store, 'dispatch')

    const { unmount } = renderComponent({ formName: 'form name' }, { store })

    expect(dispatchSpy).not.toHaveBeenCalled()

    unmount()

    expect(dispatchSpy).toHaveBeenCalledWith(setFormState('form name', { name: 'Some name' }))
  })
})
