import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'component/button/Button';

import { locals as styles } from './ChatPopup.sass';

const buttonTypePrimary = 'primary';
const buttonTypeSecondary = 'secondary';

export class ChatPopup extends Component {
  static propTypes = {
    className: PropTypes.string,
    showCta: PropTypes.bool,
    leftCtaFn: PropTypes.func,
    rightCtaFn: PropTypes.func,
    leftCtaType: PropTypes.string,
    rightCtaType: PropTypes.string,
    leftCtaLabel: PropTypes.string,
    rightCtaLabel: PropTypes.string,
    childrenOnClick: PropTypes.func,
    children: PropTypes.node
  };

  static defaultProps = {
    className: '',
    showCta: true,
    leftCtaFn: () => {},
    rightCtaFn: () => {},
    leftCtaType: buttonTypeSecondary,
    rightCtaType: buttonTypePrimary,
    leftCtaLabel: '',
    rightCtaLabel: '',
    childrenOnClick: () => {},
    children: null
  };

  isButtonPrimary = (type) => {
    return (type === buttonTypePrimary) ? true : false;
  }

  renderCta = () => {
    const {
      showCta, leftCtaFn, rightCtaFn,
      leftCtaType, rightCtaType,
      leftCtaLabel, rightCtaLabel
    } = this.props;

    return (showCta)
      ? <div className={styles.ctaContainer}>
          <Button
            label={leftCtaLabel}
            className={styles.leftCtaBtn}
            primary={this.isButtonPrimary(leftCtaType)}
            onClick={leftCtaFn} />
          <Button
            label={rightCtaLabel}
            className={styles.rightCtaBtn}
            primary={this.isButtonPrimary(rightCtaType)}
            onClick={rightCtaFn} />
        </div>
      : null;
  }

  render = () => {
    const { className, childrenOnClick, children } = this.props;

    return (
      <div className={`${className} ${styles.containerWrapper}`}>
        <div className={styles.container}>
          <div onClick={childrenOnClick}>{children}</div>
          {this.renderCta()}
        </div>
      </div>
    );
  }
}

