import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { FocusJailContainer } from '@zendeskgarden/react-modals';
import { KEY_CODES } from '@zendeskgarden/react-selection';
import { ThemeProvider } from '@zendeskgarden/react-theming';

import Navigation from 'component/frame/Navigation';
import { generateWebWidgetPreviewCSS } from 'utility/color/styles';
import { i18n } from 'service/i18n';
import { getGardenOverrides } from './gardenOverrides';
import { getDocumentHost } from 'utility/globals';

export class EmbedWrapper extends Component {
  static propTypes = {
    baseCSS: PropTypes.string,
    children: PropTypes.object,
    fullscreen: PropTypes.bool,
    handleBackClick: PropTypes.func,
    handleCloseClick: PropTypes.func,
    hideCloseButton: PropTypes.bool,
    reduxStore: PropTypes.object.isRequired,
    useBackButton: PropTypes.bool,
    document: PropTypes.object.isRequired
  };

  static defaultProps = {
    baseCSS: '',
    children: undefined,
    fullscreen: false,
    handleBackClick: () => {},
    handleCloseClick: () => {},
    hideCloseButton: false,
    useBackButton: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = { css: '' };

    this.embed = null;
    this.nav = null;
  }

  setButtonColor = (color) => {
    const css = generateWebWidgetPreviewCSS({ base: color });

    if (css) {
      this.setState({ css });
    }
  }

  getEmbedWrapperProps = (ref) => {
    return {
      ref,
      onKeyDown: evt => {
        const { target: { ownerDocument }, keyCode } = evt;
        const frameElem = ownerDocument.defaultView.frameElement;

        if (frameElem.id === 'launcher') {
          if (keyCode === KEY_CODES.TAB) {
            getDocumentHost().querySelector('body').focus();
            evt.preventDefault();
          }

          return;
        }

        if (keyCode === KEY_CODES.ESCAPE) {
          this.closeEmbed();
        }
      }
    };
  }

  closeEmbed = () => {
    this.props.handleCloseClick();
    // Due to the tabIndex switching based on visibility
    // we need to move focus on the next tick
    setTimeout(() => {
      const doc = getDocumentHost().querySelector('#launcher');

      if (doc) {
        doc.contentDocument.querySelector('button').focus();
      }
    }, 0);
  }

  render = () => {
    const styleTag = <style dangerouslySetInnerHTML={{ __html: this.state.css }} />;
    const css = <style dangerouslySetInnerHTML={{ __html: this.props.baseCSS }} />;

    const newChild = React.cloneElement(this.props.children, { ref: 'rootComponent' });

    return (
      <Provider store={this.props.reduxStore}>
        <ThemeProvider theme={getGardenOverrides()} rtl={i18n.isRTL()} document={this.props.document}>
          <FocusJailContainer focusOnMount={false}>
            {({ getContainerProps, containerRef }) => (
              <div {...getContainerProps(this.getEmbedWrapperProps(containerRef))}>
                {css}
                {styleTag}
                <Navigation
                  ref={(el) => { this.nav = el; }}
                  handleBackClick={this.props.handleBackClick}
                  handleCloseClick={this.closeEmbed}
                  fullscreen={this.props.fullscreen}
                  useBackButton={this.props.useBackButton}
                  hideCloseButton={this.props.hideCloseButton} />
                <div id='Embed' ref={(el) => { this.embed = el; }}>
                  {newChild}
                </div>
              </div>
            )}
          </FocusJailContainer>
        </ThemeProvider>
      </Provider>
    );
  }
}
