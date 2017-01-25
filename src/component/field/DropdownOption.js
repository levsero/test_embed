import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { locals as styles } from './Dropdown.sass';

export class DropdownOption extends Component {
  static propTypes = {
    title: PropTypes.string,
    nestedOptions: PropTypes.object
  }

  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleDropdownOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render = () => {
    const nestedFields = this.state.isOpen ? this.props.nestedOptions : null;

    return (
      <div className={styles.container} key={this.props.title}>
        <div className={''} onClick={this.handleDropdownOpen.bind(this)}>- {this.props.title}</div>
        <div>{nestedFields}</div>
      </div>
    );
  }
}
