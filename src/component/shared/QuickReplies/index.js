import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@zendeskgarden/react-buttons';

import { locals as styles } from './QuickReplies.scss';

export class QuickReply extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func
  }

  static defaultProps = {
    onClick: () => {}
  }

  render = () => {
    return (
      <Button pill={true} size='small' onClick={this.props.onClick}>
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
    return (
      <div className={styles.scrollContainer}>
        <div className={styles.replyContainer}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
