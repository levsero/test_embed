import { useForm } from 'react-final-form'
import createStore from 'src/redux/createStore'
import { setFormState } from 'src/redux/modules/form/actions'
import { render } from 'src/util/testHelpers'
import wait from 'src/util/wait'
import useFormBackup from '../useFormBackup'

jest.mock('react-final-form')

describe('useFormBackup', () => {
  const ExampleComponent = ({ formName }) => {
    useFormBackup(formName)
    return null
  }

  const defaultProps = {
    formName: 'form name',
  }

  const renderComponent = (props = {}, options) =>
    render(<ExampleComponent {...defaultProps} {...props} />, options)

  beforeEach(() => {
    const thing = {
      getState: () => ({
        values: {
          name: 'Some name',
        },
      }),
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
