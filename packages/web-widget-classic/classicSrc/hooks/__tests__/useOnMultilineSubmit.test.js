import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useOnMultilineSubmit from '../useOnMultilineSubmit'

describe('useOnMultilineSubmit', () => {
  // eslint-disable-next-line react/prop-types
  const RandomComponent = ({ onSubmit }) => {
    const { handleCompositionStart, handleCompositionEnd, handleKeyDown } = useOnMultilineSubmit(
      onSubmit
    )
    return (
      <textarea
        aria-label="randomText"
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onKeyDown={handleKeyDown}
      />
    )
  }

  it('submits text when Enter key is pressed', () => {
    const onSubmit = jest.fn()
    const { getByLabelText } = render(<RandomComponent onSubmit={onSubmit} />)
    userEvent.type(getByLabelText('randomText'), 'The quick brown fox')
    userEvent.type(getByLabelText('randomText'), '{enter}')
    expect(onSubmit).toBeCalled()
  })

  it('does not submit multi-line text when Shift and Enter keys are pressed', () => {
    const onSubmit = jest.fn()
    const { getByLabelText } = render(<RandomComponent onSubmit={onSubmit} />)
    userEvent.type(getByLabelText('randomText'), 'The quick{shift}{enter}brown fox')
    expect(onSubmit).not.toBeCalled()
    expect(getByLabelText('randomText')).toHaveValue('The quick\nbrown fox')
  })
})
