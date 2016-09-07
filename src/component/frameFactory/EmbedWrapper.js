import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { ButtonNav } from 'component/button/ButtonNav';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { generateNpsCSS } from 'utility/color';
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

  setHighlightColor(color) {
    const cssClasses = generateNpsCSS({ color: color });

    if (cssClasses) {
      this.setState({
        css: cssClasses
      });
    }
  }

  renderCloseButton() {
    return (
      <ButtonNav
        onClick={this.props.close}
        label={
          <Icon
            type='Icon--close'
            className='u-textInheritColor'
            isMobile={this.state.isMobile} />
        }
        rtl={i18n.isRTL()}
        position='right'
        fullscreen={this.props.fullscreen || this.state.isMobile} />
    );
  }

  renderBackButton() {
    return (
      <ButtonNav
        onClick={this.props.back}
        label={
          <Icon
            type='Icon--back'
            className='u-textInheritColor'
            isMobile={this.state.isMobile} />
        }
        rtl={i18n.isRTL()}
        position='left'
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
    const styleTag = <style dangerouslySetInnerHTML={{ __html: this.state.css }} />;
    const css = <style dangerouslySetInnerHTML={{ __html: this.props.baseCSS }} />;

    return (
      <div>
        {css}
        {styleTag}
        <div className={backButtonClasses}>
          {this.renderBackButton()}
        </div>
        <div className={closeButtonClasses}>
          {this.renderCloseButton()}
        </div>
        <div id='Embed'>
          {this.props.childFn(this.props.childParams)}
        </div>
      </div>
    );
  }
}

EmbedWrapper.propTypes = {
  back: PropTypes.func,
  baseCSS: PropTypes.string,
  close: PropTypes.func,
  fullscreen: PropTypes.bool,
  hideCloseButton: PropTypes.bool,
  childFn: PropTypes.func.isRequired,
  childParams: PropTypes.object
};

EmbedWrapper.defaultProps = {
  back: () => {},
  baseCSS: '',
  close: () => {},
  fullscreen: false,
  hideCloseButton: false,
  childParams: {}
};
