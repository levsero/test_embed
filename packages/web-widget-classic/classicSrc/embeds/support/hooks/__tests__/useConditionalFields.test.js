import useConditionalFields from 'classicSrc/embeds/support/hooks/useConditionalFields'
import getFields from 'classicSrc/embeds/support/utils/getFields'
import { render } from 'classicSrc/util/testHelpers'
import { useForm } from 'react-final-form'

jest.mock('react-final-form')
jest.mock('classicSrc/embeds/support/utils/getFields')

describe('useConditionalFields', () => {
  // eslint-disable-next-line react/prop-types
  const ExampleComponent = ({ callback }) => {
    const result = useConditionalFields()
    return <button data-testid="button" onClick={() => callback(result)} />
  }

  const renderComponent = (props = {}, options) => render(<ExampleComponent {...props} />, options)

  const initialFormValues = {
    field1: 'one',
    field2: 'two',
  }

  beforeEach(() => {
    useForm.mockReturnValue({
      getState: () => ({
        values: initialFormValues,
      }),
    })
  })

  it('returns the filtered fields', async () => {
    getFields.mockReturnValue('filtered fields')
    const callback = jest.fn()
    const { queryByTestId } = renderComponent({ callback })

    queryByTestId('button').click()

    expect(callback).toHaveBeenCalledWith('filtered fields')
  })
})
