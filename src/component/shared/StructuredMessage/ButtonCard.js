import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Card } from './pure/Card';
import { Message } from './pure/Message';
import { ButtonList } from './pure/ButtonList';
import { Button } from './pure/Button';

export class ButtonCard extends Component {
  static propTypes = {
    contents: PropTypes.array.isRequired,
    message: PropTypes.string
  };

  static defaultProps = {
    message: ''
  };

  render() {
    const { message, contents } = this.props;
    const buttons = contents.map(button => {
      return (
        <Button label={button.data.label} />
      );
    });

    return (
      <Card>
        <Message message={message} />
        {buttons.length > 0
          ? <ButtonList>
            {buttons}
          </ButtonList>
          : null}
      </Card>
    );
  }
}
