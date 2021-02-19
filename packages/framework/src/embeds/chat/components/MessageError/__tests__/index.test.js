import MessageError from '../'
import { fireEvent } from '@testing-library/react'
import { render } from 'utility/testHelpers'

const renderComponent = (inProps) => {
  const props = {
    errorMessage: 'this is an error',
    onClick: null,
    ...inProps,
  }
  return render(<MessageError {...props} />)
}

describe('MessageError', () => {
  it('renders errorMessage', () => {
    const { getByText, queryByRole } = renderComponent()
    expect(queryByRole('button')).not.toBeInTheDocument()

    expect(getByText('this is an error')).toBeInTheDocument()
  })

  it('fires handler when error message is clicked', () => {
    const onClick = jest.fn()
    const { queryByText, queryByRole } = renderComponent({ onClick })

    expect(queryByRole('button')).toBeInTheDocument()

    expect(onClick).not.toHaveBeenCalled()
    fireEvent.click(queryByText('this is an error'))
    expect(onClick).toHaveBeenCalled()
  })
})
