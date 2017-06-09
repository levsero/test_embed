import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonNav } from 'component/button/ButtonNav';
import { i18n } from 'service/i18n';
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
    hideCloseButton: PropTypes.bool,
    reduxStore: PropTypes.object.isRequired
  };

  static defaultProps = {
    baseCSS: '',
    childFn: undefined,
    childParams: {},
    children: undefined,
    fullscreen: false,
    handleBackClick: () => {},
    handleCloseClick: () => {},
    hideCloseButton: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      css: '',
      isMobile: false,
      showBackButton: false,
      showCloseButton: !props.hideCloseButton
    };

    this.embed = null;
  }

  showBackButton = (show = true) => {
    this.setState({ showBackButton: show });
  }

  showCloseButton = (show = true) => {
    this.setState({ showCloseButton: show });
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
              onClick: this.props.handleCloseClick,
              icon: 'Icon--close',
              position: isRTL ? 'left' : 'right',
              isHidden: !this.state.showCloseButton
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
