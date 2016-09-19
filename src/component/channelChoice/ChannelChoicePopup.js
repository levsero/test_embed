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
      <div className='Container--popover u-posAbsolute Container--channelChoicePopup'>
        <ButtonIcon
          className='u-block'
          onClick={this.handleClick('chat')}
          //label={i18n.t('embeddable_framework.channelChoice.button.label.chat')}
          label='Live Chat'
          icon='Icon--chat' />
        <ButtonIcon
          className='u-block'
          onClick={this.handleClick('submitTicket')}
          //label={i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')}
          label='Leave a Message'
          icon='Icon--form' />
      </div>
    );
  }
}

ChannelChoicePopup.propTypes = {
  onNextClick: PropTypes.func.isRequired
};
