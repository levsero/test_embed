import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { locals as styles } from './EmbedWrapper.sass';
import { ButtonNav } from 'component/button/ButtonNav';
import { Icon } from 'component/Icon';
import { generateNpsCSS,
         generateWebWidgetPreviewCSS } from 'utility/color';

import { Provider } from 'react-redux';

export class EmbedWrapper extends Component {
  static propTypes = {
    isRTL: PropTypes.bool.isRequired,
    baseCSS: PropTypes.string,
    childFn: PropTypes.func.isRequired,
    childParams: PropTypes.object,
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
    childParams: {},
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
  }

  showBackButton = (show = true) => {
    this.setState({ showBackButton: show });
  }

  setHighlightColor = (color) => {
    const css = generateNpsCSS({ color });

    if (css) {
      this.setState({ css });
    }
  }

  setButtonColor = (color) => {
    const css = generateWebWidgetPreviewCSS(color);

    if (css) {
      this.setState({ css });
    }
  }

  renderNavButton = (options = {}) => {
    if (options.isHidden) return;

    return (
      <ButtonNav
        onClick={options.onClick}
        label={
          <Icon
            type={options.icon}
            className='u-textInheritColor'
            isMobile={this.state.isMobile} />
        }
        rtl={this.props.isRTL}
        position={options.position}
        className={options.className}
        fullscreen={this.props.fullscreen || this.state.isMobile} />
    );
  }

  render = () => {
    const { isRTL } = this.props;
    const styleTag = <style dangerouslySetInnerHTML={{ __html: this.state.css }} />;
    const css = <style dangerouslySetInnerHTML={{ __html: this.props.baseCSS }} />;
    const expandClasses = isRTL ? 'u-posStartL' : 'u-posEndL';
    const closeClasses = isRTL ? styles.closeBtn : '';
    const backClasses = isRTL ? styles.backBtn : '';

    return (
      <Provider store={this.props.reduxStore}>
        <div>
          {css}
          {styleTag}
          <div>
            {this.renderNavButton({
              onClick: this.props.handleBackClick,
              icon: 'Icon--back',
              position: isRTL ? 'right' : 'left',
              className: backClasses,
              isHidden: !this.state.showBackButton
            })}
          </div>
          <div>
            {this.renderNavButton({
              onClick: this.props.handleExpandClick,
              icon: 'Icon--chevron',
              position: 'right',
              className: expandClasses,
              isHidden: !this.props.showExpandButton
            })}
          </div>
          <div>
            {this.renderNavButton({
              onClick: this.props.handleCloseClick,
              icon: 'Icon--close',
              position: isRTL ? 'left' : 'right',
              className: closeClasses,
              isHidden: this.props.hideCloseButton
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
