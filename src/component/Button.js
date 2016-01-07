import React, { Component, PropTypes } from 'react';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { LoadingSpinner } from 'component/Loading';

const classNames = require('classnames');

class Button extends Component {
  static defaultProps = {
    fullscreen: false,
    disabled: false,
    onClick: () => {},
    type: 'submit',
    className: '',
    style: null
  };

  static propTypes = {
    label: React.PropTypes.string.isRequired,
    fullscreen: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    type: React.PropTypes.string,
    className: React.PropTypes.string,
    style: React.PropTypes.element
  };
  
  render() {
    const buttonClasses = classNames({
      'c-btn c-btn--medium c-btn--primary': true,
      'Anim-color u-textNoWrap u-borderTransparent u-userBackgroundColor': true,
      'u-sizeFull u-textSizeBaseMobile': props.fullscreen,
      [`${props.className}`]: true
    });
    const allowedTypes = /^(submit|button)$/i;
    const type = allowedTypes.test(props.type)
              ? props.type
              : 'button';
  
    return (
      <input
        type={type}
        value={props.label}
        onClick={props.onClick}
        onTouchStart={props.onClick}
        disabled={props.disabled}
        style={props.style}
        className={buttonClasses} />
    );
  }
}

class ButtonNav extends Component {
  static defaultProps = {
    rtl: false,
    fullscreen: false,
    position: 'left',
    onClick: () => {}
  };
  
  static propTypes = {
    label: React.PropTypes.element.isRequired,
    rtl: React.PropTypes.bool,
    fullscreen: React.PropTypes.bool,
    position: React.PropTypes.string,
    onClick: React.PropTypes.func
  };

  render() {
    const { fullscreen, position, rtl } = props;
    const isLeft = (position === 'left');
    const isRight = (position === 'right');
    const buttonClasses = classNames({
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
        onClick={props.onClick}
        onTouchStart={props.onClick}
        className={buttonClasses}>
        {props.label}
      </div>
    );
  }
}

class ButtonPill extends Component {
  static defaultProps = {
    fullscreen: false
  };
  
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    fullscreen: React.PropTypes.bool
  };
  
  render() {
    const buttonClasses = classNames({
      'c-btn c-btn--medium c-btn--secondary c-btn--pill': true,
      'u-textNormal': true,
      'u-sizeFull u-textSizeBaseMobile is-mobile': props.fullscreen,
      'u-textNoWrap': i18n.isRTL()
    });
  
    return (
      <div
        className={buttonClasses}>
        {props.label}
        <Icon type='Icon--link' />
      </div>
    );
  }
}

class ButtonSecondary extends Component {
  static defaultProps = {
    disabled: false,
    className: '',
    style: null,
    onClick: () => {}
  };
  
  static propTypes = {
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ]).isRequired,
    disabled: React.PropTypes.bool,
    className: React.PropTypes.string,
    style: React.PropTypes.element,
    onClick: React.PropTypes.func
  };

  render() {
    const buttonClasses = classNames({
      'c-btn c-btn--medium c-btn--secondary': true,
      [props.className]: true
    });
  
    return (props.disabled)
        ? <div
            className={buttonClasses}
            style={props.style}
            disabled={true}>
            {props.label}
          </div>
        : <div
            onClick={props.onClick}
            onTouchStart={props.onClick}
            className={buttonClasses}
            style={props.style}>
            {props.label}
          </div>;
  }
}

class ButtonGroup extends Component {
  static defaultProps = {
    rtl: false,
    fullscreen: false,
    style: null
  };
  
  static propTypes = {
    children: React.PropTypes.element.isRequired,
    rtl: React.PropTypes.bool,
    fullscreen: React.PropTypes.bool,
    style: React.PropTypes.element
  };

  render() {
    const buttonClasses = classNames({
      'ButtonGroup': true,
      'u-textRight': !props.fullscreen && !props.rtl,
      'u-textLeft': !props.fullscreen && props.rtl
    });
  
    return (
      <div
        style={props.style}
        className={buttonClasses}>
        {props.children}
    </div>
    );
  }
}

class ButtonRating extends Component {
  static defaultProps = {
    highlightColor: '#77a500',
    selected: false,
    loading: false,
    label: null,
    loadingSpinnerClassName: '',
    disabled: false,
    onClick: () => {}
  };
  
  static propTypes = {
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
  };

  render() {
    const ButtonRatingClasses = classNames({
      'ButtonRating': true,
      'is-mobile': props.fullscreen,
      'u-userBackgroundColor u-userTextColorConstrast': props.selected,
      'u-userBorderColor': props.selected,
      'u-userTextColor': !props.selected,
      'is-disabled': props.disabled
    });
  
    const label = props.loading
                ? <LoadingSpinner
                    className={`u-userFillColorContrast ${props.loadingSpinnerClassName}`} />
                : `${props.label}`;
  
    return (
      <ButtonSecondary
        label={label}
        onClick={props.onClick}
        className={ButtonRatingClasses}
        disabled={props.disabled} />
    );
  }
}

export {
  Button,
  ButtonNav,
  ButtonPill,
  ButtonSecondary,
  ButtonGroup,
  ButtonRating
};
