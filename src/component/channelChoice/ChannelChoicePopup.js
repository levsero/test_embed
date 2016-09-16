import React, { Component, PropTypes } from 'react';

import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';
import { ButtonIcon } from 'component/button/ButtonIcon';

export class ChannelChoicePopup extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, ChannelChoicePopup.prototype);
  }

  handleClick(embed) {
    return () => this.props.onNextClick(embed);
  }

  render() {
    return (
      <div className='Container--channelChoicePopup'>
        <ButtonIcon
          onClick={this.handleClick('chat')}
          label={i18n.t('embeddable_framework.channelChoice.button.label.chat')}
          icon='Icon--chat' />
        <ButtonIcon
          onClick={this.handleClick('submitTicket')}
          label={i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')}
          icon='Icon--avatar' />
      </div>
    );
  }
}

ChannelChoicePopup.propTypes = {
  onNextClick: PropTypes.func.isRequired
};
