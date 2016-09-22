import React, { Component, PropTypes } from 'react';

import { Button } from 'component/button/Button';
import { Container } from 'component/Container';
import { ScrollContainer } from 'component/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';

export class ChannelChoice extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, ChannelChoice.prototype);
  }

  handleClick(embed) {
    return () => this.props.onNextClick(embed);
  }

  renderZendeskLogo() {
    return !this.props.hideZendeskLogo
      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />
      : null;
  }

  renderBody() {
    return (
      <div>
        <p>{i18n.t('embeddable_framework.helpCenter.label.linkContext.submitTicket')}</p>
        <div>
          <Button
            fullscreen={false}
            label={i18n.t(
              'embeddable_framework.channelChoice.button.label.chat',
              { fallback: 'Live chat' }
            )}
            onClick={this.handleClick('chat')} />
          <br />
          <Button
            fullscreen={false}
            label={i18n.t(
              'embeddable_framework.channelChoice.button.label.submitTicket',
              { fallback: 'Leave a message' }
            )}
            onClick={this.handleClick('submitTicket')} />
        </div>
        <hr />
      </div>
    );
  }

  render() {
    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <Container style={this.props.style}>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={this.props.hideZendeskLogo}
          title={i18n.t(`embeddable_framework.helpCenter.form.title.${this.props.formTitleKey}`)}>
          {this.renderBody()}
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </Container>
    );
  }
}

ChannelChoice.propTypes = {
  updateFrameSize: PropTypes.func,
  style: PropTypes.object,
  formTitleKey: PropTypes.string,
  hideZendeskLogo: PropTypes.bool,
  onNextClick: PropTypes.func
};

ChannelChoice.defaultProps = {
  updateFrameSize: () => {},
  style: {},
  formTitleKey: 'help',
  hideZendeskLogo: false,
  onNextClick: () => {}
};

