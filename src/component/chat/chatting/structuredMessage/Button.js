import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button as PureButton } from 'component/shared/StructuredMessage/pure/Button';
import { CHAT_STRUCTURED_MESSAGE_ACTION_TYPE } from 'constants/chat';

const { QUICK_REPLY_ACTION, LINK_ACTION } = CHAT_STRUCTURED_MESSAGE_ACTION_TYPE;

const ActionPropType = PropTypes.shape({
  type: PropTypes.oneOf([QUICK_REPLY_ACTION, LINK_ACTION]).isRequired,
  value: PropTypes.string.isRequired
});

const ButtonSchemaShape = {
  text: PropTypes.string.isRequired,
  action: ActionPropType.isRequired
};

export const ButtonSchemaPropType = PropTypes.shape(ButtonSchemaShape);

export class Button extends Component {
  static propTypes = {
    ...ButtonSchemaShape,
    createAction: PropTypes.func
  };

  render() {
    const { text, createAction, action } = this.props;

    return (
      <PureButton label={text} onClick={createAction(action)} />
    );
  }
}
