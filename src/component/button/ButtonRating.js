import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { LoadingSpinner } from 'component/Loading';
import { ButtonSecondary } from 'component/button/ButtonSecondary';

export class ButtonRating extends Component {
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
