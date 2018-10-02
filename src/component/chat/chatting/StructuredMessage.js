import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonCard } from './structuredMessage/ButtonCard';
import { CHAT_STRUCTURED_MESSAGE_TYPE } from 'constants/chat';

export class StructuredMessage extends Component {
  static propTypes = {
    schema: PropTypes.oneOfType([
      PropTypes.shape(
        Object.assign({type: PropTypes.string}, ButtonCard.propTypes)
      )
    ]).isRequired
  }

  render() {
    const {schema: {type}} = this.props;

    switch (type) {
      case CHAT_STRUCTURED_MESSAGE_TYPE.BUTTON_TEMPLATE:
        const { buttons, msg } = this.props.schema;

        return <ButtonCard buttons={buttons} msg={msg} />;
    }
  }
}
