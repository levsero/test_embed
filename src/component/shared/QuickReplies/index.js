import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@zendeskgarden/react-buttons';
import classNames from 'classnames';

import { locals as styles } from './QuickReplies.scss';

export class QuickReply extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    onClick: () => {}
  }

  render = () => {
    const className = classNames(this.props.className, styles.quickReply);

    return (
      <Button className={className} pill={true} size='small' onClick={this.props.onClick}>
        {this.props.label}
      </Button>
    );
  }
}

export class QuickReplies extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired
  }

  render = () => {
    const newChildren = React.Children.map(this.props.children, child => (
      React.cloneElement(child, {
        className: classNames(child.props.className, styles.item)
      })
    ));

    return (
      <div className={styles.scrollContainer}>
        <div className={styles.replyContainer}>
          {newChildren}
        </div>
      </div>
    );
  }
}
