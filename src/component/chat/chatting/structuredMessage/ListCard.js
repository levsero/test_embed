import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ListCard as PureListCard } from 'component/shared/StructuredMessage/ListCard';
import { Button, ButtonSchemaPropType } from './Button';

export class ListCard extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    buttons: PropTypes.arrayOf(ButtonSchemaPropType),
    createAction: PropTypes.func.isRequired,
  }

  static defaultProps = {
    items: [],
    buttons: [],
  }

  render() {
    const { createAction } = this.props;

    const buttons = this.props.buttons && this.props.buttons.map((button, index) => {
      return <Button {...button} key={index} createAction={createAction} />;
    });

    const items = this.props.items.map((item) => {
      return {
        ...item,
        onClick: (item.action) ? createAction(item.action) : null,
        imageUrl: item.image_url,
        layout: 'thumbnail',
        align: 'right',
        headingLineClamp: 1
      };
    });

    return (
      <PureListCard items={items} buttons={buttons} />
    );
  }
}
