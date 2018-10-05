import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonCard as PureButtonCard, Button } from 'component/shared/StructuredMessage/ButtonCard';
import { CHAT_STRUCTURED_MESSAGE_ACTION_TYPE } from 'constants/chat';

const { QUICK_REPLY_ACTION, LINK_ACTION } = CHAT_STRUCTURED_MESSAGE_ACTION_TYPE;

const ActionPropType = PropTypes.shape({
  type: PropTypes.oneOf([QUICK_REPLY_ACTION, LINK_ACTION]).isRequired,
  value: PropTypes.string.isRequired
});

const ButtonSchemaPropType = PropTypes.shape({
  text: PropTypes.string.isRequired,
  action: ActionPropType.isRequired
});

export class ButtonCard extends Component {
    static propTypes = {
      ...ButtonCard.schemaPropTypes,
      // Other props
      createAction: PropTypes.func.isRequired,
    };

    static defaultProps = {
      msg: ''
    };

    static schemaPropTypes = {
      buttons: PropTypes.arrayOf(ButtonSchemaPropType).isRequired,
      msg: PropTypes.string
    };

    render() {
      const buttons = this.props.buttons.map((button, index) => (
        <Button label={button.text} key={index} onClick={this.props.createAction(button.action)} />
      ));

      return (
        <PureButtonCard message={this.props.msg}>
          {buttons}
        </PureButtonCard>
      );
    }
}
