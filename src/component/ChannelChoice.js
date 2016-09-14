import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { i18n } from 'service/i18n';
import { mediator } from 'service/mediator';
import { bindMethods } from 'utility/utils';

export class ChannelChoice extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, ChannelChoice.prototype);
  }

  handleTicketFormClick() {
    mediator.channel.broadcast(`helpCenterForm.onNextClick`, 'submitTicket');
  }

  handleLiveChatClick() {
    mediator.channel.broadcast(`helpCenterForm.onNextClick`, 'chat');
  }

  render() {
    return (
      <div className='Container--channelChoice'>
        <div onClick={this.handleTicketFormClick}>
          Submit a Ticket
        </div>
        <hr/>
        <div onClick={this.handleLiveChatClick}>
          Live Chat
        </div>
      </div>
    );
  }
}
