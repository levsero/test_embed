import React from 'react'
import PropTypes from 'prop-types'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import styled from 'styled-components'
import 'jest-styled-components'

import reducer from 'src/redux/modules/reducer'
import WidgetThemeProvider from '../'

function renderWithRedux(ui, { initialState } = {}) {
  const store = createStore(reducer, initialState)
  return render(
    <Provider store={store}>
      <WidgetThemeProvider>{ui}</WidgetThemeProvider>
    </Provider>
  )
}

const generateTestID = variableName => `${variableName}Id`

const TestButton = ({ className, themeVariableName }) => (
  <button className={className} data-testid={generateTestID(themeVariableName)} />
)

TestButton.propTypes = {
  className: PropTypes.string,
  themeVariableName: PropTypes.string.isRequired
}

const StyledTestButton = styled(TestButton)`
  color: ${props => props.theme[props.themeVariableName]};
`

describe('connected WidgetThemeProvider', () => {
  describe('using default widget theme', () => {
    const expectedDefaultColours = {
      baseColor: '#1F73B7',
      baseHighlightColor: '#227EC9',
      buttonColorStr: '#1F73B7',
      buttonHighlightColorStr: '#227EC9',
      buttonTextColorStr: '#FFFFFF',
      listColorStr: '#1F73B7',
      listHighlightColorStr: '#227EC9',
      linkColorStr: '#1F73B7',
      linkTextColorStr: '#1F73B7',
      headerColorStr: '#1F73B7',
      headerTextColorStr: '#FFFFFF',
      headerFocusRingColorStr: 'rgba(31,115,183,0.4)',
      headerBackgroundColorStr: '#227EC9',
      iconColor: '#1F73B7'
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
      baseHighlightColor: '#84B300',
      buttonColorStr: '#78A300',
      buttonHighlightColorStr: '#84B300',
      buttonTextColorStr: '#28320A',
      listColorStr: '#28320A',
      listHighlightColorStr: '#2C370B',
      linkColorStr: '#28320A',
      linkTextColorStr: '#28320A',
      headerColorStr: '#78A300',
      headerTextColorStr: '#28320A',
      headerFocusRingColorStr: 'rgba(120,163,0,0.4)',
      headerBackgroundColorStr: '#84B300',
      iconColor: '#78A300'
    }

    for (let colorVariableName in expectedThemedColours) {
      it(`uses a themed '${colorVariableName}' theme variable to style a component`, () => {
        const { getByTestId } = renderWithRedux(
          <StyledTestButton themeVariableName={colorVariableName} />,
          {
            initialState: { settings: { color: { theme: '#78a300' } } }
          }
        )
        expect(getByTestId(generateTestID(colorVariableName))).toHaveStyleRule(
          'color',
          expectedThemedColours[colorVariableName]
        )
      })
    }
  })
})
