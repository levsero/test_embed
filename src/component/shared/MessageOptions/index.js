import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './MessageOptions.scss';

export class MessageOptions extends Component {
  static propTypes = {
    optionItemStyle: PropTypes.string,
    optionItems: PropTypes.array,
    isMessageBubbleLinked: PropTypes.bool
  };

  static defaultProps = {
    optionItemStyle: '',
    optionItems: [],
    isMessageBubbleLinked: false
  }

  render() {
    const optionElems = this.props.optionItems.map((child, index) => {
      const firstItemBordersStyle = (index === 0 && !this.props.isMessageBubbleLinked) ? styles.firstItemBorders : '';
      const lastItemBordersStyle = (index === this.props.optionItems.length - 1) ? styles.lastItemBorders : '';
      const childStyle =  `${styles.optionItem} ` +
                          `${this.props.optionItemStyle} ` +
                          `${firstItemBordersStyle} ` +
                          `${lastItemBordersStyle}`;

      return (
        <li className={childStyle} key={index}>
          {child}
        </li>
      );
    });

    return (
      <ul>
        {optionElems}
      </ul>
    );
  }
}
