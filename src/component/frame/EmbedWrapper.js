import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { ButtonNav } from 'component/button/ButtonNav';
import { Icon } from 'component/Icon';
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
        rtl={i18n.isRTL()}
        position={options.position}
        className={options.className}
        fullscreen={this.props.fullscreen || this.state.isMobile} />
    );
  }

  render = () => {
    const isRTL = i18n.isRTL();
    const styleTag = <style dangerouslySetInnerHTML={{ __html: this.state.css }} />;
    const css = <style dangerouslySetInnerHTML={{ __html: this.props.baseCSS }} />;
    const expandClasses = isRTL ? 'u-posStartL' : 'u-posEndL';

    // childFn is from frameFactory and children is from Frame component
    const newChild = (typeof this.props.children !== 'undefined')
                   ? React.cloneElement(this.props.children, { ref: 'rootComponent' })
                   : this.props.childFn(this.props.childParams);

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
              isHidden: this.props.hideCloseButton
            })}
          </div>
          <div id='Embed' ref={(el) => { this.embed = el; }}>
            {newChild}
          </div>
        </div>
      </Provider>
    );
  }
}
