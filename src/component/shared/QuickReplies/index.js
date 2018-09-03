import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@zendeskgarden/react-buttons';

import { locals as styles } from './QuickReplies.scss';

export class QuickReplies extends Component {
  static propTypes = {
    items: PropTypes.array,
    handleReplyClick: PropTypes.func
  }

  static defaultProps = {
    items: [],
    handleReplyClick: () => {}
  }

  render = () => {
    return (
      <div className={styles.scrollContainer}>
        <div className={styles.replyContainer}>
          {this.props.items.map((item, idx) => {
            return (
              <div key={idx} className={styles.item}>
                <Button
                  pill={true}
                  size='small'
                  onClick={() => this.props.handleReplyClick(item.value)}
                >
                  {item.label}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
