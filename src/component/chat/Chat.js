import React, { Component, PropTypes } from 'react';

import { ScrollContainer } from 'component/container/ScrollContainer';
import { Container } from 'component/container/Container';

export class Chat extends Component {
  render = () => {
    return (
      <Container
        style={this.props.style}
        position={this.props.position}
        expanded={true}>
        <ScrollContainer
          title={'chat yo'}
          contentExpanded={true} />
      </Container>
    );
  }
}

Chat.propTypes = {
  style: PropTypes.object,
  position: PropTypes.string
};

Chat.defaultProps = {
  style: null,
  position: 'right'
};
