import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { locals as styles } from './Dropdown.sass';

export class DropdownOption extends Component {
  static propTypes = {
    title: PropTypes.string,
    nestedOptions: PropTypes.object,
    onClick: PropTypes.func
  }

  constructor (props) {
    super(props);
  }

  handleDropdownOpen = () => {
    if (this.props.nestedOptions !== null) {
      // this.setState({ isOpen: !this.state.isOpen });
      this.props.updateScreen(this.props.nestedOptions, this.props.title);
    } else {
      this.props.onClick();
    }
  }

  render = () => {
    const hasNestedFields = this.props.nestedOptions !== null;
    const nestedFields = hasNestedFields ? this.props.nestedOptions : null;
    const arrow = hasNestedFields ? '->' : '';

    return (
      <div className={styles.field} key={this.props.title}>
        <div className={''} onClick={this.handleDropdownOpen}>{arrow} {this.props.title}</div>
      </div>
    );
  }
}
