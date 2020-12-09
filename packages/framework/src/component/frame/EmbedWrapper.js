import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Router } from 'react-router-dom'
import { connect } from 'react-redux'
import { DEFAULT_THEME, ThemeProvider } from '@zendeskgarden/react-theming'

import { WidgetThemeProvider } from 'src/components/Widget'
import { i18n } from 'service/i18n'
import { getGardenOverrides } from './gardenOverrides'
import { getColor } from 'src/redux/modules/selectors'
import { handleEscapeKeyPressed } from 'src/redux/modules/base'
import FocusJail from 'components/FrameFocusJail'
import history from 'service/history'

class EmbedWrapper extends Component {
  static propTypes = {
    baseCSS: PropTypes.string,
    customCSS: PropTypes.string,
    children: PropTypes.object,
    reduxStore: PropTypes.object.isRequired,
    document: PropTypes.object,
    dataTestId: PropTypes.string,
    name: PropTypes.string
  }

  static defaultProps = {
    baseCSS: '',
    customCSS: '',
    children: undefined,
    fullscreen: false,
    hideNavigationButtons: false,
    useBackButton: false,
    isChatPreview: false
  }

  constructor(props, context) {
    super(props, context)
    this.embed = null
    this.nav = null
  }

  render = () => {
    const styleTag = <style dangerouslySetInnerHTML={{ __html: this.props.customCSS }} />
    const css = <style dangerouslySetInnerHTML={{ __html: this.props.baseCSS }} />

    const newChild = React.cloneElement(this.props.children, {
      ref: 'rootComponent'
    })

    return (
      <Router history={history}>
        <ThemeProvider
          theme={{
            ...DEFAULT_THEME,
            document: this.props.document,
            rtl: i18n.isRTL(),
            components: getGardenOverrides(getColor(this.props.reduxStore.getState(), 'webWidget'))
          }}
        >
          <WidgetThemeProvider>
            <FocusJail name={this.props.name}>
              {css}
              {styleTag}
              <div
                id="Embed"
                data-testid={`position-${this.props.dataTestId}`}
                ref={el => {
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
  handleEscapeKeyPressed
}

export default connect(
  null,
  actionCreators,
  null,
  { forwardRef: true }
)(EmbedWrapper)