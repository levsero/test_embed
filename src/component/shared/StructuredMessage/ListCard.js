import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonList } from './pure/ButtonList';
import { Panel } from './pure/Panel';

import { locals as styles } from './ListCard.scss';

export const ItemPropType = PropTypes.shape({
  heading: PropTypes.string.isRequired,
  paragraph: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  headingLineClamp: PropTypes.number,
  onClick: PropTypes.func,
  layout: PropTypes.oneOf(['hero', 'thumbnail']),
  align: PropTypes.oneOf(['left', 'right']),
  roundedTop: PropTypes.bool,
  roundedBottom: PropTypes.bool,
  withBorderBottom: PropTypes.bool
});

export class ListCard extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(ItemPropType).isRequired,
    buttons: PropTypes.node
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
            item.withBorderBottom = false;

            if (!idx) {
              item.roundedTop = true;
            } else if (idx === items.length - 1) {
              item.roundedBottom = (buttons.length === 0);
              item.withBorderBottom = true;
            }

            return (
              <li key={idx}>
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
