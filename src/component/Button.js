import React from 'react/addons';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { LoadingSpinner } from 'component/Loading';

const classSet = React.addons.classSet;

var Button = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    type: React.PropTypes.string
  },

  render() {
    /* jshint laxbreak: true */
    const buttonClasses = classSet({
      'c-btn c-btn--medium c-btn--primary': true,
      'Anim-color u-textNoWrap u-borderTransparent u-userBackgroundColor': true,
      'u-sizeFull u-textSizeBaseMobile': this.props.fullscreen,
      [`${this.props.className}`]: true
    });
    const allowedTypes = /^(submit|button)$/i;
    const type = allowedTypes.test(this.props.type)
               ? this.props.type
               : 'button';

    return (
      <input
        type={type}
        value={this.props.label}
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
        disabled={this.props.disabled}
        style={this.props.style}
        className={buttonClasses} />
    );
  }
});

var ButtonNav = React.createClass({
  render() {
    const { fullscreen, position, rtl } = this.props;
    const isLeft = (position === 'left');
    const isRight = (position === 'right');
    const buttonClasses = classSet({
      'Button Button--nav u-posAbsolute u-posStart--vert': true,
      'u-posStart u-paddingL': isLeft && !rtl,
      'u-posEnd': isLeft && rtl,
      'u-posEnd--flush': (isLeft && rtl && fullscreen) || (isRight && !rtl && fullscreen),
      'u-isActionable u-textSizeBaseMobile u-posStart--vertFlush': fullscreen,
      'u-posEnd u-paddingR': isRight && !rtl,
      'u-posStart': isRight && rtl,
      'u-posStart--flush': (isRight && rtl && fullscreen) || (isLeft && !rtl && fullscreen),
      'u-flipText': rtl
    });

    return (
      <div
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
        className={buttonClasses}>
        {this.props.label}
      </div>
    );
  }
});

var ButtonPill = React.createClass({
  render() {
    const buttonClasses = classSet({
      'c-btn c-btn--medium c-btn--secondary c-btn--pill': true,
      'u-textNormal': true,
      'u-sizeFull u-textSizeBaseMobile is-mobile': this.props.fullscreen,
      'u-textNoWrap': i18n.isRTL()
    });

    return (
      <div
        className={buttonClasses}>
        {this.props.label}
        <Icon type='Icon--link' />
      </div>
    );
  }
});

var ButtonSecondary = React.createClass({
  getDefaultProps() {
    return {
      className: ''
    };
  },

  propTypes: {
    label: React.PropTypes.oneOfType([
      React.PropTypes.string.isRequired,
      React.PropTypes.element
    ])
  },

  render() {
    const buttonClasses = classSet({
      'c-btn c-btn--medium c-btn--secondary': true,
      [this.props.className]: true
    });

    return (
      <div
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
        className={buttonClasses}
        style={this.props.style}>
        {this.props.label}
      </div>
    );
  }
});

var ButtonGroup = React.createClass({
  propTypes: {
    rtl: React.PropTypes.bool.isRequired
  },

  render() {
    const buttonClasses = classSet({
      'ButtonGroup': true,
      'u-textRight': !this.props.fullscreen && !this.props.rtl,
      'u-textLeft': !this.props.fullscreen && this.props.rtl
    });

    return (
      <div
        style={this.props.style}
        className={buttonClasses}>
        {this.props.children}
     </div>
    );
  }
});

var ButtonRating = React.createClass({
  getDefaultProps() {
    return {
      highlightColor: '',
      selected: false,
      loading: false,
      label: null
    };
  },

  render() {
    /* jshint laxbreak: true */
    const isSelectedStyles = {
      borderColor: this.props.highlightColor,
      background: this.props.highlightColor,
      color: this.props.highlightColor
           ? this.props.generateHighlightColor(this.props.highlightColor)
           : '#fff'
    };

    const isNotSelectedStyles = {
      color: this.props.highlightColor || 'auto'
    };

    const style = (this.props.selected)
                ? isSelectedStyles
                : isNotSelectedStyles;

    const label = this.props.loading
                ? <LoadingSpinner className={this.props.loadingSpinnerClassName} {...this.props} />
                : this.props.label;

    return <ButtonSecondary
             style={style}
             label={label}
             onClick={this.props.onClick}
             className='RatingsList-btn u-paddingAN' />;
  }
});

export {
  Button,
  ButtonNav,
  ButtonPill,
  ButtonSecondary,
  ButtonGroup,
  ButtonRating
};
