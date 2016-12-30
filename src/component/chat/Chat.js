import React, { Component, PropTypes } from 'react';

import { ScrollContainer } from 'component/container/ScrollContainer';
import { Container } from 'component/container/Container';

export class Chat extends Component {
  static propTypes = {
    position: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    position: 'right',
    style: null
  };

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
