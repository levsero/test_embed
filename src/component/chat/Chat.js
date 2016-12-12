import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { ScrollContainer } from 'component/ScrollContainer';

export class Chat extends Component {
  render() {
    return (
      <ScrollContainer
        title={'chat yo'}
        contentExpanded={true}>
      </ScrollContainer>
    );
  }
}
