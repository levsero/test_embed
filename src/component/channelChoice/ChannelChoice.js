import React, { Component, PropTypes } from 'react';

import { Button } from 'component/button/Button';
import { Container } from 'component/Container';
import { ScrollContainer } from 'component/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';

export class ChannelChoice extends Component {
  renderZendeskLogo() {
    return !this.props.hideZendeskLogo
      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />
      : null;
  }

  renderBody() {
    const submitTicketLabel = i18n.t(
      `embeddable_framework.helpCenter.submitButton.label.submitTicket.${this.props.buttonLabelKey}`
    );

    return (
      <div>
        <p>Do you have a question?</p>
        <div>
          <Button
            fullscreen={false}
            label='Live chat'
            onClick={this.props.handleOnClickChat} />
          <br />
          <Button
            fullscreen={false}
            label={submitTicketLabel}
            onClick={this.props.handleOnClickTicket} />
        </div>
        <hr />
      </div>
    );
  }

  render() {
    setTimeout( () => this.props.updateFrameSize(), 0);

    return (
      <Container style={this.props.style}>
        <div>
          <ScrollContainer
            ref='scrollContainer'
            hideZendeskLogo={this.props.hideZendeskLogo}
            title={i18n.t(`embeddable_framework.helpCenter.form.title.${this.props.formTitleKey}`)}>
            {this.renderBody()}
          </ScrollContainer>
          {this.renderZendeskLogo()}
        </div>
      </Container>
    );
  }
}

ChannelChoice.propTypes = {
  updateFrameSize: PropTypes.func,
  style: PropTypes.object,
  formTitleKey: PropTypes.string,
  buttonLabelKey: PropTypes.string,
  hideZendeskLogo: PropTypes.bool,
  handleOnClickChat: PropTypes.func,
  handleOnClickTicket: PropTypes.func
};

ChannelChoice.defaultProps = {
  updateFrameSize: () => {},
  style: {},
  formTitleKey: 'help',
  buttonLabelKey: 'message',
  hideZendeskLogo: false,
  handleOnClickChat: () => {},
  handleOnClickTicket: () => {}
};

