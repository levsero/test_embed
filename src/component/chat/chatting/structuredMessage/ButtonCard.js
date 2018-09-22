import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Card } from 'component/shared/StructuredMessage/pure/Card';
import { Message } from 'component/shared/StructuredMessage/pure/Message';
import { ButtonList } from 'component/shared/StructuredMessage/pure/ButtonList';
import { Button } from 'component/shared/StructuredMessage/pure/Button';

const ButtonSchemaPropType = PropTypes.shape({
  text: PropTypes.string.isRequired,
  action: PropTypes.object.isRequired
});

export class ButtonCard extends Component {
    static propTypes = {
      buttons: PropTypes.arrayOf(ButtonSchemaPropType),
      msg: PropTypes.string
    };

    static defaultProps = {
      msg: ''
    };

    render() {
      const buttons = this.props.buttons.map(button => (
        <Button label={button.text} />
      ));

      return (
        <Card>
          <Message message={this.props.msg} />
          {buttons.length > 0
            ? <ButtonList>
              {buttons}
            </ButtonList>
            : null
          }
        </Card>
      );
    }
}
