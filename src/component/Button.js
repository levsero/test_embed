import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { LoadingSpinner } from 'component/Loading';

class Button extends Component {
  render() {
    const buttonClasses = classNames({
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
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  fullscreen: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.element
};

Button.defaultProps = {
  fullscreen: false,
  disabled: false,
  onClick: () => {},
  type: 'submit',
  className: '',
  style: null
};

class ButtonNav extends Component {
  render() {
    const { fullscreen, position, rtl } = this.props;
    const isLeft = (position === 'left');
    const isRight = (position === 'right');
    const buttonClasses = classNames({
      'Button Button--nav u-posAbsolute u-posStart--vertFlush': true,
      'u-posStart u-paddingL': isLeft && !rtl,
      'u-posEnd': isLeft && rtl,
      'u-posEnd--flush': (isLeft && rtl && fullscreen) || (isRight && !rtl && fullscreen),
      'u-isActionable u-textSizeBaseMobile': fullscreen,
      'u-posEnd u-paddingR': isRight && !rtl,
      'u-posStart': isRight && rtl,
      'u-posStart--flush': (isRight && rtl && fullscreen) || (isLeft && !rtl && fullscreen),
      'u-flipText': rtl
    });

    return (
      <div className='u-posRelative u-zIndex1'>
        <div
          onClick={this.props.onClick}
          onTouchStart={this.props.onClick}
          className={buttonClasses}>
          {this.props.label}
        </div>
      </div>
    );
  }
}

ButtonNav.propTypes = {
  label: PropTypes.element.isRequired,
  rtl: PropTypes.bool,
  fullscreen: PropTypes.bool,
  position: PropTypes.string,
  onClick: PropTypes.func
};

ButtonNav.defaultProps = {
  rtl: false,
  fullscreen: false,
  position: 'left',
  onClick: () => {}
};

class ButtonPill extends Component {
  render() {
    const buttonClasses = classNames({
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
}

ButtonPill.propTypes = {
  label: PropTypes.string.isRequired,
  fullscreen: PropTypes.bool
};

ButtonPill.defaultProps = {
  fullscreen: false
};

class ButtonSecondary extends Component {
  render() {
    const buttonClasses = classNames({
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
}

ButtonSecondary.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.element,
  onClick: PropTypes.func
};

ButtonSecondary.defaultProps = {
  disabled: false,
  className: '',
  style: null,
  onClick: () => {}
};

class ButtonGroup extends Component {
  render() {
    const buttonClasses = classNames({
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
}

ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
  rtl: PropTypes.bool,
  fullscreen: PropTypes.bool,
  style: PropTypes.element
};

ButtonGroup.defaultProps = {
  rtl: false,
  fullscreen: false,
  style: null
};

class ButtonRating extends Component {
  render() {
    const ButtonRatingClasses = classNames({
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
}

ButtonRating.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  fullscreen: PropTypes.bool,
  highlightColor: PropTypes.string,
  selected: PropTypes.bool,
  loading: PropTypes.bool,
  loadingSpinnerClassName: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};

ButtonRating.defaultProps = {
  highlightColor: '#77a500',
  selected: false,
  loading: false,
  label: '',
  loadingSpinnerClassName: '',
  disabled: false,
  onClick: () => {}
};

class ButtonDropzone extends Component {
  render() {
    return (
      <Dropzone
        onDrop={this.props.onDrop}
        className='Form-field--display u-marginVM Container--dashed'>
        <div className='u-textCenter'>
          <Icon type='Icon--link' />
          {i18n.t('embeddable_framework.submitTicket.attachments.button.label',
            { fallback: 'Add file or drop here' }
          )}
        </div>
      </Dropzone>
    );
  }
}

ButtonDropzone.propTypes = {
  onDrop: PropTypes.func
};

ButtonDropzone.defaultProps = {
  onDrop: () => {}
};

export {
  Button,
  ButtonNav,
  ButtonPill,
  ButtonSecondary,
  ButtonGroup,
  ButtonRating,
  ButtonDropzone
};
