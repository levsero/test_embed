import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonList } from './pure/ButtonList';
import { Panel } from './pure/Panel';

import { locals as styles } from './ListCard.scss';

export class ListCard extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    buttons: PropTypes.node.isRequired,
    createAction: PropTypes.func
  };

  static defaultProps = {
    buttons: []
  };

  render() {
    const { items, buttons } = this.props;

    return (
      <div className={styles.cardContainer}>
        <ul className={styles.panelList}>
          {items.map((item, idx) => {
            item.borderBottomWidth = false;

            if (!idx) {
              item.roundedTop = true;
            } else if (idx === items.length - 1) {
              item.roundedBottom = (buttons.length === 0);
              item.borderBottomWidth = true;
            }

            return (
              <li key={idx} onClick={this.props.createAction}>
                <Panel panel={item}/>
              </li>
            );
          })}
        </ul>
        <ButtonList>
          {buttons}
        </ButtonList>
      </div>
    );
  }
}
