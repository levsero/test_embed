import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ScrollContainer } from 'component/container/ScrollContainer';

import { i18n } from 'service/i18n';

export class Talk extends Component {
  static propTypes = {
    getFrameDimensions: PropTypes.func.isRequired,
    hideZendeskLogo: PropTypes.bool,
    updateFrameSize: PropTypes.func,
    formTitleKey: PropTypes.string
  };

  static defaultProps = {
    hideZendeskLogo: false,
    updateFrameSize: () => {},
    formTitleKey: ''
  };

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <ScrollContainer
        ref='scrollContainer'
        hideZendeskLogo={this.props.hideZendeskLogo}
        getFrameDimensions={this.props.getFrameDimensions}
        title={i18n.t(`embeddable_framework.talk.form.title.${this.props.formTitleKey}`, { fallback: 'Talk' })} />
    );
  }
}
