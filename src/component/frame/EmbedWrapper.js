import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import Navigation from 'component/frame/Navigation';
import { generateWebWidgetPreviewCSS } from 'utility/color/styles';

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
    newDesign: PropTypes.bool
  };

  static defaultProps = {
    baseCSS: '',
    children: undefined,
    fullscreen: false,
    handleBackClick: () => {},
    handleCloseClick: () => {},
    hideCloseButton: false,
    useBackButton: false,
    newDesign: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = { css: '' };

    this.embed = null;
    this.nav = null;
  }

  showCloseButton = (show = true) => {
    this.nav.getWrappedInstance().showCloseButton(show);
  }

  setButtonColor = (color) => {
    const css = generateWebWidgetPreviewCSS(color);

    if (css) {
      this.setState({ css });
    }
  }

  render = () => {
    const styleTag = <style dangerouslySetInnerHTML={{ __html: this.state.css }} />;
    const css = <style dangerouslySetInnerHTML={{ __html: this.props.baseCSS }} />;

    const newChild = React.cloneElement(this.props.children, { ref: 'rootComponent' });

    return (
      <Provider store={this.props.reduxStore}>
        <div>
          {css}
          {styleTag}
          <Navigation
            ref={(el) => { this.nav = el; }}
            handleBackClick={this.props.handleBackClick}
            handleCloseClick={this.props.handleCloseClick}
            fullscreen={this.props.fullscreen}
            useBackButton={this.props.useBackButton}
            hideCloseButton={this.props.hideCloseButton}
            newDesign={this.props.newDesign} />
          <div id='Embed' ref={(el) => { this.embed = el; }}>
            {newChild}
          </div>
        </div>
      </Provider>
    );
  }
}
