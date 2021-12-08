import { FONT_SIZE } from 'classicSrc/constants/shared'
import { getColor } from 'classicSrc/redux/modules/selectors'
import { getWidgetColorVariables } from 'classicSrc/util/color/styles'
import { getThemeColor } from 'classicSrc/util/color/validate'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { isMobileBrowser } from '@zendesk/widget-shared-services'

const themeColors = (baseColors) => {
  const themeColor = getThemeColor()
  return getWidgetColorVariables({ ...themeColor, ...baseColors })
}

const WidgetThemeProvider = ({ children, theme }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

WidgetThemeProvider.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.shape({
    baseColor: PropTypes.string,
    baseHighlightColor: PropTypes.string,
    buttonColorStr: PropTypes.string,
    buttonHighlightColorStr: PropTypes.string,
    buttonTextColorStr: PropTypes.string,
    listColorStr: PropTypes.string,
    listHighlightColorStr: PropTypes.string,
    linkColorStr: PropTypes.string,
    linkTextColorStr: PropTypes.string,
    headerColorStr: PropTypes.string,
    headerTextColorStr: PropTypes.string,
    headerFocusRingColorStr: PropTypes.string,
    headerBackgroundColorStr: PropTypes.string,
    iconColor: PropTypes.string,
    isMobile: PropTypes.bool,
  }).isRequired,
}

WidgetThemeProvider.defaultProps = {
  children: [],
}

const mapStateToProps = (state, ownProps) => ({
  theme: {
    ...themeColors(getColor(state, 'webWidget')),
    fontSize: FONT_SIZE,
    isMobile: isMobileBrowser(),
    ...ownProps.theme,
  },
})

const connectedComponent = connect(mapStateToProps, null)(WidgetThemeProvider)

export { connectedComponent as default, WidgetThemeProvider as Component }
