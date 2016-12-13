import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { ScrollContainer } from 'component/ScrollContainer';
import { Container } from 'component/Container';

export class Chat extends Component {
  render() {
    return (
      <Container
        style={this.props.style}
        position={this.props.position}
        expanded={true}>
        <ScrollContainer
          title={'chat yo'}
          contentExpanded={true}>
        </ScrollContainer>
      </Container>
    );
  }
}
