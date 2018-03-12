import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './MessageOptions.scss';
import classNames from 'classNames';

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
      const childClasses = classNames(
        styles.optionItem,
        this.props.optionItemStyle,
        {
          [styles.firstItemBorders]: index === 0 && !this.props.isMessageBubbleLinked,
          [styles.lastItemBorders]: index === this.props.optionItems.length - 1
        }
      );

      return (
        <li className={childClasses} key={index}>
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
