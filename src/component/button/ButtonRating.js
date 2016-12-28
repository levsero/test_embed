import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { LoadingSpinner } from 'component/loading/Loading';
import { ButtonSecondary } from 'component/button/ButtonSecondary';

export class ButtonRating extends Component {
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]).isRequired,
    disabled: PropTypes.bool,
    fullscreen: PropTypes.bool,
    highlightColor: PropTypes.string,
    loading: PropTypes.bool,
    loadingSpinnerClassName: PropTypes.string,
    onClick: PropTypes.func,
    selected: PropTypes.bool
  };

  static defaultProps = {
    disabled: false,
    highlightColor: '#77a500',
    label: '',
    loading: false,
    loadingSpinnerClassName: '',
    onClick: () => {},
    selected: false
  };

  render = () => {
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
