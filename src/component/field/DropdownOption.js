import React, { Component, PropTypes } from 'react';

import { locals as styles } from './DropdownOption.sass';

export class DropdownOption extends Component {
  static propTypes = {
    title: PropTypes.string,
    nestedMenu: PropTypes.object,
    onClick: PropTypes.func,
    updateMenu: PropTypes.func
  }

  static defaultProps = {
    nestedMenu: null,
    title: '',
    onClick: () => {},
    updateScreen: () => {}
  }

  handleDropdownOpen = () => {
    if (this.props.nestedMenu !== null) {
      this.props.updateMenu(this.props.nestedMenu, this.props.title);
    } else {
      this.props.onClick();
    }
  }

  renderNextArrow = () => {
    return <div className={styles.arrowNext} />;
  }

  render = () => {
    const hasNestedFields = this.props.nestedMenu !== null;
    const arrow = hasNestedFields ? this.renderNextArrow() : '';

    return (
      <div className={styles.field} key={this.props.title} onClick={this.handleDropdownOpen}>
        <div>{this.props.title} {arrow}</div>
      </div>
    );
  }
}
