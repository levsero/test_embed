import { render } from '@testing-library/react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import styled from 'styled-components'
import { DEFAULT_BASE_COLOR } from 'src/constants/shared'
import reducer from 'src/redux/modules/reducer'
import WidgetThemeProvider from '../index'

function renderWithRedux(ui, { initialState } = {}) {
  const store = createStore(reducer, initialState)
  return render(
    <Provider store={store}>
      <WidgetThemeProvider>{ui}</WidgetThemeProvider>
    </Provider>
  )
}

const generateTestID = (variableName) => `${variableName}Id`

const TestButton = ({ className, themeVariableName }) => (
  <button className={className} data-testid={generateTestID(themeVariableName)} />
)

TestButton.propTypes = {
  className: PropTypes.string,
  themeVariableName: PropTypes.string.isRequired,
}

const StyledTestButton = styled(TestButton)`
  color: ${(props) => props.theme[props.themeVariableName]};
`

const TestParagraph = ({ className }) => (
  <p id="testParagraph" className={className}>
    Boop
  </p>
)

TestParagraph.propTypes = {
  className: PropTypes.string,
}

const StyledTestParagraph = styled(TestParagraph)`
  font-size: ${(props) => 2 * props.theme.fontSize}px;
`

describe('connected WidgetThemeProvider', () => {
  describe('using default widget theme', () => {
    const expectedDefaultColours = {
      baseColor: DEFAULT_BASE_COLOR,
      baseHighlightColor: '#195055',
      buttonColorStr: DEFAULT_BASE_COLOR,
      buttonHighlightColorStr: '#195055',
      buttonTextColorStr: '#FFFFFF',
      listColorStr: DEFAULT_BASE_COLOR,
      listHighlightColorStr: '#195055',
      linkColorStr: DEFAULT_BASE_COLOR,
      linkTextColorStr: DEFAULT_BASE_COLOR,
      headerColorStr: DEFAULT_BASE_COLOR,
      headerTextColorStr: '#FFFFFF',
      headerFocusRingColorStr: 'rgba(23,73,77,0.4)',
      headerBackgroundColorStr: '#195055',
      iconColor: DEFAULT_BASE_COLOR,
    }

    for (let colorVariableName in expectedDefaultColours) {
      it(`uses a default '${colorVariableName}' theme variable to style a component`, () => {
        const { getByTestId } = renderWithRedux(
          <StyledTestButton themeVariableName={colorVariableName} />
        )
        expect(getByTestId(generateTestID(colorVariableName))).toHaveStyleRule(
          'color',
          expectedDefaultColours[colorVariableName]
        )
      })
    }
  })

  describe('custom Widget Theme based on - settings: color: theme', () => {
    const expectedThemedColours = {
      baseColor: '#78A300',
      baseHighlightColor: '#668B00',
      buttonColorStr: '#2F3941',
      buttonHighlightColorStr: '#343F48',
      buttonTextColorStr: '#FFFFFF',
      listColorStr: '#28320A',
      listHighlightColorStr: '#2C370B',
      linkColorStr: '#28320A',
      linkTextColorStr: '#28320A',
      headerColorStr: '#78A300',
      headerTextColorStr: '#28320A',
      headerFocusRingColorStr: 'rgba(120,163,0,0.4)',
      headerBackgroundColorStr: '#668B00',
      iconColor: '#87929D',
    }

    for (let colorVariableName in expectedThemedColours) {
      it(`uses a themed '${colorVariableName}' theme variable to style a component`, () => {
        const { getByTestId } = renderWithRedux(
          <StyledTestButton themeVariableName={colorVariableName} />,
          {
            initialState: { settings: { color: { theme: '#78a300' } } },
          }
        )
        expect(getByTestId(generateTestID(colorVariableName))).toHaveStyleRule(
          'color',
          expectedThemedColours[colorVariableName]
        )
      })
    }
  })

  describe('font sizes', () => {
    it('uses themed fontSize', () => {
      renderWithRedux(<StyledTestParagraph />)
      expect(document.getElementById('testParagraph')).toHaveStyleRule(`
      font-size: 28px`)
    })
  })
})
