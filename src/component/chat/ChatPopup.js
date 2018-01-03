import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'component/button/Button';

import { locals as styles } from './ChatPopup.scss';

export class ChatPopup extends Component {
  static propTypes = {
    className: PropTypes.string,
    showCta: PropTypes.bool,
    leftCtaFn: PropTypes.func,
    rightCtaFn: PropTypes.func,
    leftCtaLabel: PropTypes.string,
    rightCtaLabel: PropTypes.string,
    rightCtaDisabled: PropTypes.bool,
    childrenOnClick: PropTypes.func,
    children: PropTypes.node
  };

  static defaultProps = {
    className: '',
    showCta: true,
    leftCtaFn: () => {},
    rightCtaFn: () => {},
    leftCtaLabel: '',
    rightCtaLabel: '',
    rightCtaDisabled: false,
    childrenOnClick: () => {},
    children: null
  };

  renderCta = () => {
    const {
      showCta, leftCtaFn, rightCtaFn,
      leftCtaLabel, rightCtaLabel, rightCtaDisabled
    } = this.props;

    return (showCta)
      ? <div className={styles.ctaContainer}>
          <Button
            label={leftCtaLabel}
            className={styles.leftCtaBtn}
            primary={false}
            onClick={leftCtaFn} />
          <Button
            label={rightCtaLabel}
            className={styles.rightCtaBtn}
            primary={true}
            disabled={rightCtaDisabled}
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

