import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { FocusJailContainer } from '@zendeskgarden/react-modals'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import { ThemeProvider } from '@zendeskgarden/react-theming'

import Navigation from 'component/frame/Navigation'
import { i18n } from 'service/i18n'
import { getGardenOverrides } from './gardenOverrides'
import { focusLauncher, getDocumentHost } from 'utility/globals'
import { getColor } from 'src/redux/modules/selectors'

export class EmbedWrapper extends Component {
  static propTypes = {
    baseCSS: PropTypes.string,
    children: PropTypes.object,
    fullscreen: PropTypes.bool,
    handleBackClick: PropTypes.func,
    hideNavigationButtons: PropTypes.bool,
    reduxStore: PropTypes.object.isRequired,
    useBackButton: PropTypes.bool,
    document: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired
  }

  static defaultProps = {
    baseCSS: '',
    children: undefined,
    fullscreen: false,
    handleBackClick: () => {},
    hideNavigationButtons: false,
    useBackButton: false,
    isChatPreview: false
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      css: ''
    }

    this.embed = null
    this.nav = null
  }

  setCustomCSS = css => {
    this.setState({ css })
  }

  getEmbedWrapperProps = ref => {
    return {
      ref,
      onKeyDown: evt => {
        const {
          target: { ownerDocument },
          keyCode
        } = evt
        const frameElem = ownerDocument.defaultView.frameElement

        if (frameElem.id === 'launcher') {
          if (keyCode === KEY_CODES.TAB) {
            getDocumentHost()
              .querySelector('body')
              .focus()
            evt.preventDefault()
          }

          return
        }

        if (keyCode === KEY_CODES.ESCAPE) {
          focusLauncher()
        }
      }
    }
  }

  render = () => {
    const styleTag = <style dangerouslySetInnerHTML={{ __html: this.state.css }} />
    const css = <style dangerouslySetInnerHTML={{ __html: this.props.baseCSS }} />

    const newChild = React.cloneElement(this.props.children, {
      ref: 'rootComponent'
    })

    return (
      <Provider store={this.props.reduxStore}>
        <MemoryRouter>
          <ThemeProvider
            theme={getGardenOverrides(getColor(this.props.reduxStore.getState(), 'webWidget'))}
            rtl={i18n.isRTL()}
            document={this.props.document}
          >
            <FocusJailContainer focusOnMount={false}>
              {({ getContainerProps, containerRef }) => (
                <div {...getContainerProps(this.getEmbedWrapperProps(containerRef))}>
                  {css}
                  {styleTag}
                  <Navigation
                    ref={el => {
                      this.nav = el
                    }}
                    handleBackClick={this.props.handleBackClick}
                    handleOnCloseFocusChange={focusLauncher}
                    fullscreen={this.props.fullscreen}
                    isMobile={this.props.isMobile}
                    useBackButton={this.props.useBackButton}
                    hideNavigationButtons={this.props.hideNavigationButtons}
                  />
                  <div
                    id="Embed"
                    ref={el => {
                      this.embed = el
                    }}
                  >
                    {newChild}
                  </div>
                </div>
              )}
            </FocusJailContainer>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    )
  }
}
