import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { ButtonNav } from 'component/button/ButtonNav';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { generateNpsCSS,
         generateWebWidgetPreviewCSS } from 'utility/color';
import { bindMethods } from 'utility/utils';

import { Provider } from 'react-redux';

export class EmbedWrapper extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      css: '',
      showBackButton: false,
      isMobile: false
    };
  }

  showBackButton = (show = true) => {
    this.setState({ showBackButton: show });
  }

  setHighlightColor = (color) => {
    const css = generateNpsCSS({ color: color });

    if (css) {
      this.setState({ css: css });
    }
  }

  setButtonColor = (color) => {
    const css = generateWebWidgetPreviewCSS(color);

    if (css) {
      this.setState({ css: css });
    }
  }

  renderNavButton = (options = {}) => {
    return (
      <ButtonNav
        onClick={options.onClick}
        label={
          <Icon
            type={options.icon}
            className='u-textInheritColor'
            isMobile={this.state.isMobile} />
        }
        rtl={i18n.isRTL()}
        position={options.position}
        className={options.className}
        fullscreen={this.props.fullscreen || this.state.isMobile} />
    );
  }

  render = () => {
    const backButtonClasses = classNames({
      'u-isHidden': !this.state.showBackButton
    });
    const closeButtonClasses = classNames({
      'closeButton': true,
      'u-isHidden': this.props.hideCloseButton
    });
    const expandButtonClasses = classNames({
      'closeButton': true,
      'u-isHidden': !this.props.showExpandButton
    });
    const styleTag = <style dangerouslySetInnerHTML={{ __html: this.state.css }} />;
    const css = <style dangerouslySetInnerHTML={{ __html: this.props.baseCSS }} />;
    const expandClasses = i18n.isRTL() ? 'u-posStartL' : 'u-posEndL';

    return (
      <Provider store={this.props.reduxStore}>
        <div>
          {css}
          {styleTag}
          <div className={backButtonClasses}>
            {this.renderNavButton({
              onClick: this.props.handleBackClick,
              icon: 'Icon--back',
              position: 'left'
            })}
          </div>
          <div className={expandButtonClasses}>
            {this.renderNavButton({
              onClick: this.props.handleExpandClick,
              icon: 'Icon--caret',
              position: 'right',
              className: expandClasses
            })}
          </div>
          <div className={closeButtonClasses}>
            {this.renderNavButton({
              onClick: this.props.handleCloseClick,
              icon: 'Icon--close',
              position: 'right'
            })}
          </div>
          <div id='Embed'>
            {this.props.childFn(this.props.childParams)}
          </div>
        </div>
      </Provider>
    );
  }
}

EmbedWrapper.propTypes = {
  handleBackClick: PropTypes.func,
  baseCSS: PropTypes.string,
  reduxStore: PropTypes.object.isRequired,
  handleCloseClick: PropTypes.func,
  handleExpandClick: PropTypes.func,
  fullscreen: PropTypes.bool,
  hideCloseButton: PropTypes.bool,
  childFn: PropTypes.func.isRequired,
  childParams: PropTypes.object,
  showExpandButton: PropTypes.bool
};

EmbedWrapper.defaultProps = {
  handleBackClick: () => {},
  baseCSS: '',
  handleCloseClick: () => {},
  handleExpandClick: () => {},
  fullscreen: false,
  hideCloseButton: false,
  childParams: {},
  showExpandButton: false
};
