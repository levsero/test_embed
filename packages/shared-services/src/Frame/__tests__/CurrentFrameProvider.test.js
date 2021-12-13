import { render } from '@testing-library/react'
import CurrentFrameProvider, {
  useCurrentFrame,
  CurrentFrameConsumer,
} from '../CurrentFrameProvider'

describe('CurrentFrameProvider', () => {
  const renderWithProvider = (value, children) => {
    return render(<CurrentFrameProvider value={value}>{children}</CurrentFrameProvider>)
  }

  const renderWithoutProvider = (children) => {
    return render(children)
  }

  describe('useCurrentFrame', () => {
    // eslint-disable-next-line react/prop-types
    const ExampleComponent = ({ onClick }) => {
      const frame = useCurrentFrame()

      return <button onClick={() => onClick(frame)}>Example component</button>
    }

    describe('when no provider', () => {
      it('uses the host document and window', () => {
        const onClick = jest.fn()

        const { queryByText } = renderWithoutProvider(<ExampleComponent onClick={onClick} />)

        queryByText('Example component').click()

        expect(onClick).toHaveBeenCalledWith({
          document,
          window,
        })
      })
    })

    describe('when a provider exists', () => {
      it('uses the values provided by the provider', () => {
        const value = {
          document: Symbol(),
          window: Symbol(),
        }

        const onClick = jest.fn()

        const { queryByText } = renderWithProvider(value, <ExampleComponent onClick={onClick} />)

        queryByText('Example component').click()

        expect(onClick).toHaveBeenCalledWith(value)
      })
    })
  })

  describe('CurrentFrameConsumer', () => {
    // eslint-disable-next-line react/prop-types
    const ExampleComponent = ({ onClick }) => {
      return (
        <CurrentFrameConsumer>
          {(frame) => <button onClick={() => onClick(frame)}>Example component</button>}
        </CurrentFrameConsumer>
      )
    }

    describe('when no provider', () => {
      it('uses the host document and window', () => {
        const onClick = jest.fn()

        const { queryByText } = renderWithoutProvider(<ExampleComponent onClick={onClick} />)

        queryByText('Example component').click()

        expect(onClick).toHaveBeenCalledWith({
          document,
          window,
        })
      })
    })

    describe('when a provider exists', () => {
      it('uses the values provided by the provider', () => {
        const value = {
          document: Symbol(),
          window: Symbol(),
        }

        const onClick = jest.fn()

        const { queryByText } = renderWithProvider(value, <ExampleComponent onClick={onClick} />)

        queryByText('Example component').click()

        expect(onClick).toHaveBeenCalledWith(value)
      })
    })
  })
})
