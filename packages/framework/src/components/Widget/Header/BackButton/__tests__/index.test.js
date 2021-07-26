import { useOnBack } from 'src/component/webWidget/OnBackProvider'
import { TEST_IDS } from 'src/constants/shared'
import * as selectors from 'src/redux/modules/selectors/selectors'
import { render } from 'src/util/testHelpers'
import { Component as BackButton } from '../'

jest.mock('src/component/webWidget/OnBackProvider')

describe('BackButton', () => {
  const goBackSpy = jest.fn()

  const renderComponent = (props = {}) => {
    const defaultProps = {
      useReactRouter: true,
      history: {},
    }

    return render(<BackButton {...defaultProps} {...props} />)
  }

  describe('when using React Router', () => {
    const history = {
      goBack: goBackSpy,
      length: 2,
    }

    it('uses the history goBack method', () => {
      const { queryByTestId } = renderComponent({ history })

      queryByTestId(TEST_IDS.ICON_BACK).click(0)

      expect(goBackSpy).toHaveBeenCalled()
    })

    describe('visibility is controlled by the presence of history', () => {
      describe('when history is >= two layers deep', () => {
        it('renders', () => {
          const { queryByTestId } = renderComponent({ history })

          expect(queryByTestId(TEST_IDS.ICON_BACK)).toBeInTheDocument()
        })
      })

      describe('when history is < 2 layers deep', () => {
        ;[0, 1].forEach((length) => {
          it('does not render', () => {
            const { queryByTestId } = renderComponent({ history: { ...history, length } })

            expect(queryByTestId(TEST_IDS.ICON_BACK)).not.toBeInTheDocument()
          })
        })
      })
    })
  })

  describe('when using the legacy routing rules', () => {
    beforeEach(() => {
      jest.spyOn(selectors, 'getShowBackButton').mockReturnValue(true)
    })

    it('uses the onBack hook', () => {
      const onBack = jest.fn()
      useOnBack.mockReturnValue(onBack)

      const { queryByTestId } = renderComponent({ useReactRouter: false })

      queryByTestId(TEST_IDS.ICON_BACK).click(0)

      expect(onBack).toHaveBeenCalled()
    })

    describe('visibility is controlled by showBackButton', () => {
      describe('when showBackButton is true', () => {
        it('renders', () => {
          const { queryByTestId } = renderComponent({ useReactRouter: false })

          expect(queryByTestId(TEST_IDS.ICON_BACK)).toBeInTheDocument()
        })
      })

      describe('when showBackButton is false', () => {
        beforeEach(() => {
          jest.spyOn(selectors, 'getShowBackButton').mockReturnValue(false)
        })

        it('does not render', () => {
          const { queryByTestId } = renderComponent({ useReactRouter: false })

          expect(queryByTestId(TEST_IDS.ICON_BACK)).not.toBeInTheDocument()
        })
      })
    })
  })
})
