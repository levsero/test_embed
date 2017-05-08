import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ButtonNav } from 'component/button/ButtonNav';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { generateNpsCSS,
         generateWebWidgetPreviewCSS } from 'utility/color';

import { Provider } from 'react-redux';

export class EmbedWrapper extends Component {
  static propTypes = {
    baseCSS: PropTypes.string,
    childFn: PropTypes.func,
    childParams: PropTypes.object,
    children: PropTypes.object,
    fullscreen: PropTypes.bool,
    handleBackClick: PropTypes.func,
    handleCloseClick: PropTypes.func,
    handleExpandClick: PropTypes.func,
    hideCloseButton: PropTypes.bool,
    reduxStore: PropTypes.object.isRequired,
    showExpandButton: PropTypes.bool
  };

  static defaultProps = {
    baseCSS: '',
    childFn: undefined,
    childParams: {},
    children: undefined,
    fullscreen: false,
    handleBackClick: () => {},
    handleCloseClick: () => {},
    handleExpandClick: () => {},
    hideCloseButton: false,
    showExpandButton: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      css: '',
      isMobile: false,
      showBackButton: false
    };

    this.embed = null;
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

    // childFn is from frameFactory and children is from Frame component
    const newChild = (typeof this.props.children !== 'undefined')
                   ? React.cloneElement(this.props.children, { ref: 'rootComponent' })
                   : this.props.childFn(this.props.childParams);

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
              icon: 'Icon--chevron',
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
          <div id='Embed' ref={(el) => {this.embed = el;}}>
            {newChild}
          </div>
        </div>
      </Provider>
    );
  }
}
