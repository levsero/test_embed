import PropTypes from 'prop-types'
import { cloneElement, Component } from 'react'
import { connect } from 'react-redux'
import { Router } from 'react-router-dom'
import { DEFAULT_THEME, ThemeProvider } from '@zendeskgarden/react-theming'
import history from 'service/history'
import { i18n } from 'src/apps/webWidget/services/i18n'
import FocusJail from 'src/components/FrameFocusJail'
import { WidgetThemeProvider } from 'src/components/Widget'
import { handleEscapeKeyPressed } from 'src/redux/modules/base'
import { getColor } from 'src/redux/modules/selectors'
import { getGardenOverrides } from './gardenOverrides'

class EmbedWrapper extends Component {
  static propTypes = {
    baseCSS: PropTypes.string,
    customCSS: PropTypes.string,
    children: PropTypes.object,
    reduxStore: PropTypes.object.isRequired,
    document: PropTypes.object,
    dataTestId: PropTypes.string,
    name: PropTypes.string,
  }

  static defaultProps = {
    baseCSS: '',
    customCSS: '',
    children: undefined,
    fullscreen: false,
    hideNavigationButtons: false,
    useBackButton: false,
    isChatPreview: false,
  }

  constructor(props, context) {
    super(props, context)
    this.embed = null
    this.nav = null
  }

  render = () => {
    const styleTag = <style dangerouslySetInnerHTML={{ __html: this.props.customCSS }} />
    const css = <style dangerouslySetInnerHTML={{ __html: this.props.baseCSS }} />

    const newChild = cloneElement(this.props.children, {
      ref: 'rootComponent',
    })

    return (
      <Router history={history}>
        <ThemeProvider
          theme={{
            ...DEFAULT_THEME,
            document: this.props.document,
            rtl: i18n.isRTL(),
            components: getGardenOverrides(getColor(this.props.reduxStore.getState(), 'webWidget')),
          }}
        >
          <WidgetThemeProvider>
            <FocusJail name={this.props.name}>
              {css}
              {styleTag}
              <div
                id="Embed"
                data-testid={`position-${this.props.dataTestId}`}
                ref={(el) => {
                  this.embed = el
                }}
              >
                {newChild}
              </div>
            </FocusJail>
          </WidgetThemeProvider>
        </ThemeProvider>
      </Router>
    )
  }
}

const actionCreators = {
  handleEscapeKeyPressed,
}

export default connect(null, actionCreators, null, { forwardRef: true })(EmbedWrapper)
