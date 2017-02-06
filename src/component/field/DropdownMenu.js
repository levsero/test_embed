import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { locals as styles } from './Dropdown.sass';

import { DropdownOption } from 'component/field/DropdownOption';
import { i18n } from 'service/i18n';

export class DropdownMenu extends Component {
  static propTypes = {
    options: PropTypes.array,
    backButton: PropTypes.bool,
    handleBackClick: PropTypes.func
  }

  static defaultProps = {
    options: [],
    backButton: false,
    handleBackClick: () => {}
  }

  renderBackArrow = () => {
    if (!this.props.backButton) return;

    return (
      <div
        className={`${styles.field} ${styles.back}`}
        onClick={this.props.handleBackClick}>
        <div className={styles.arrowBack} />
        {i18n.t('embeddable_framework.navigation.back')}
      </div>
    );
  }

  renderOptions = () => {
    return _.map(this.props.options, (option) => {
      return (
        <DropdownOption
          ref={_.uniqueId('option-')}
          title={option.title}
          key={option.title}
          onClick={option.onClick || _.noop}
          nestedMenu={option.nestedMenu || null}
          updateMenu={option.updateMenu || _.noop} />
      );
    });
  }

  render = () => {
    return (
      <div className={styles.menu}>
        {this.renderBackArrow()}
        {this.renderOptions()}
      </div>
    );
  }
}
