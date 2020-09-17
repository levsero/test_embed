import React from 'react'
import { useForm, useFormState } from 'react-final-form'
import { render } from 'src/util/testHelpers'
import useConditionalFields from 'embeds/support/hooks/useConditionalFields'
import getFields from 'embeds/support/utils/getFields'

jest.mock('react-final-form')
jest.mock('embeds/support/utils/getFields')

describe('useConditionalFields', () => {
  // eslint-disable-next-line react/prop-types
  const ExampleComponent = ({ callback }) => {
    const result = useConditionalFields()
    return <button data-testid="button" onClick={() => callback(result)} />
  }

  const renderComponent = (props = {}, options) => render(<ExampleComponent {...props} />, options)

  const initialFormValues = {
    field1: 'one',
    field2: 'two'
  }

  let onChange
  beforeEach(() => {
    useForm.mockReturnValue({
      getState: () => ({
        values: initialFormValues
      })
    })

    useFormState.mockImplementation(options => {
      onChange = options.onChange
    })
  })

  it('returns the filtered fields', async () => {
    getFields.mockReturnValue('filtered fields')
    const callback = jest.fn()
    const { queryByTestId } = renderComponent({ callback })

    queryByTestId('button').click()

    expect(getFields)
    expect(callback).toHaveBeenCalledWith('filtered fields')
  })

  it('updates the fields when the form changes', () => {
    getFields.mockImplementation(values => values)
    const callback = jest.fn()
    const { queryByTestId } = renderComponent({ callback })
    getFields.mockClear()

    onChange({ values: { field1: 'new value', field2: 'two' } })

    queryByTestId('button').click()

    expect(callback).toHaveBeenCalledWith({
      field1: 'new value',
      field2: 'two'
    })
  })
})
