import React from 'react/addons';
import _ from 'lodash';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { LoadingSpinner } from 'component/Loading';

const classSet = React.addons.classSet;

const Button = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    fullscreen: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    type: React.PropTypes.string,
    className: React.addons.classSet,
    style: React.PropTypes.element
  },

  getDefaultProps() {
    return {
      fullscreen: false,
      disabled: false,
      onClick: _.noop(),
      type: 'submit',
      className: '',
      style: null
    };
  },

  render() {
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

const ButtonNav = React.createClass({
  propTypes: {
    label: React.PropTypes.element.isRequired,
    rtl: React.PropTypes.bool,
    fullscreen: React.PropTypes.bool,
    position: React.PropTypes.string,
    onClick: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      rtl: false,
      fullscreen: false,
      position: 'left',
      onClick: null
    };
  },

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

const ButtonPill = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    fullscreen: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      fullscreen: false
    };
  },

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

const ButtonSecondary = React.createClass({
  propTypes: {
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ]).isRequired,
    disabled: React.PropTypes.bool,
    className: React.addons.classSet,
    style: React.PropTypes.element,
    onClick: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      disabled: false,
      className: '',
      style: null,
      onClick: null
    };
  },

  render() {
    const buttonClasses = classSet({
      'c-btn c-btn--medium c-btn--secondary': true,
      [this.props.className]: true
    });

    return (this.props.disabled)
         ? <div
             className={buttonClasses}
             style={this.props.style}
             disabled={true}>
             {this.props.label}
           </div>
         : <div
             onClick={this.props.onClick}
             onTouchStart={this.props.onClick}
             className={buttonClasses}
             style={this.props.style}>
             {this.props.label}
           </div>;
  }
});

const ButtonGroup = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
    rtl: React.PropTypes.bool,
    fullscreen: React.PropTypes.bool,
    style: React.PropTypes.element,
  },

  getDefaultProps() {
    return {
      rtl: false,
      fullscreen: false,
      style: null
    };
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

const ButtonRating = React.createClass({
  propTypes: {
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ]).isRequired,
    fullscreen: React.PropTypes.bool,
    highlightColor: React.PropTypes.string,
    selected: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    loadingSpinnerClassName: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      highlightColor: '#77a500',
      selected: false,
      loading: false,
      label: null,
      loadingSpinnerClassName: '',
      disabled: false,
      onClick: _.noop()
    };
  },

  render() {
    const ButtonRatingClasses = classSet({
      'ButtonRating': true,
      'is-mobile': this.props.fullscreen,
      'u-userBackgroundColor u-userTextColorConstrast': this.props.selected,
      'u-userBorderColor': this.props.selected,
      'u-userTextColor': !this.props.selected,
      'is-disabled': this.props.disabled
    });

    const label = this.props.loading
                ? <LoadingSpinner
                    className={`u-userFillColorContrast ${this.props.loadingSpinnerClassName}`} />
                : `${this.props.label}`;

    return (
      <ButtonSecondary
        label={label}
        onClick={this.props.onClick}
        className={ButtonRatingClasses}
        disabled={this.props.disabled} />
    );
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
