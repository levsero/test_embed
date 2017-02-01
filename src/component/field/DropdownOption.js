import React, { Component, PropTypes } from 'react';

import { locals as styles } from './DropdownOption.sass';

export class DropdownOption extends Component {
  static propTypes = {
    title: PropTypes.string,
    nestedOptions: PropTypes.array,
    onClick: PropTypes.func,
    updateScreen: PropTypes.func
  }

  static defaultProps = {
    nestedOptions: null,
    title: '',
    onClick: () => {},
    updateScreen: () => {}
  }

  handleDropdownOpen = () => {
    if (this.props.nestedOptions !== null) {
      this.props.updateScreen(this.props.nestedOptions, this.props.title);
    } else {
      this.props.onClick();
    }
  }

  renderNextArrow = () => {
    return <div className={styles.arrowNext} />;
  }

  render = () => {
    const hasNestedFields = this.props.nestedOptions !== null;
    const arrow = hasNestedFields ? this.renderNextArrow() : '';

    return (
      <div className={styles.field} key={this.props.title} onClick={this.handleDropdownOpen}>
        <div>{this.props.title} {arrow}</div>
      </div>
    );
  }
}
