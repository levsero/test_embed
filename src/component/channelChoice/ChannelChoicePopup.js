import React, { Component, PropTypes } from 'react';

import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';

export class ChannelChoicePopup extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, ChannelChoicePopup.prototype);
  }

  handleClick(embed) {
    return () => {
      this.props.onNextClick(embed);
    };
  }

  render() {
    return (
      <div className='Container--channelChoicePopup'>
        <div onClick={this.handleClick('chat')}>
          {i18n.t('embeddable_framework.channelChoice.button.label.chat')}
        </div>
        <div onClick={this.handleClick('submitTicket')}>
          {i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')}
        </div>
      </div>
    );
  }
}

ChannelChoicePopup.propTypes = {
  onNextClick: PropTypes.func.isRequired
};
