import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { ButtonNav } from 'component/button/ButtonNav';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { generateNpsCSS,
         generateWebWidgetPreviewCSS } from 'utility/color';
import { bindMethods } from 'utility/utils';

export class EmbedWrapper extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, EmbedWrapper.prototype);

    this.state = {
      css: '',
      showBackButton: false,
      isMobile: false
    };
  }

  showBackButton(show = true) {
    this.setState({ showBackButton: show });
  }

  setHighlightColor(color) {
    const css = generateNpsCSS({ color: color });

    if (css) {
      this.setState({ css: css });
    }
  }

  setButtonColor(color) {
    const css = generateWebWidgetPreviewCSS(color);

    if (css) {
      this.setState({ css: css });
    }
  }

  renderNavButton(options = {}) {
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

  render() {
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

    return (
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
            className: 'u-posEndL' // Add RTL styles
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
    );
  }
}

EmbedWrapper.propTypes = {
  handleBackClick: PropTypes.func,
  baseCSS: PropTypes.string,
  handleCloseClick: PropTypes.func,
  fullscreen: PropTypes.bool,
  hideCloseButton: PropTypes.bool,
  childFn: PropTypes.func.isRequired,
  childParams: PropTypes.object
};

EmbedWrapper.defaultProps = {
  handleBackClick: () => {},
  baseCSS: '',
  handleCloseClick: () => {},
  fullscreen: false,
  hideCloseButton: false,
  childParams: {}
};
