import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonCard as PureButtonCard, Button } from 'component/shared/StructuredMessage/ButtonCard';

const ButtonSchemaPropType = PropTypes.shape({
  text: PropTypes.string.isRequired,
  action: PropTypes.object.isRequired
});

export class ButtonCard extends Component {
    static propTypes = {
      // Props related to structured message schema
      buttons: PropTypes.arrayOf(ButtonSchemaPropType).isRequired,
      msg: PropTypes.string,

      // Other props
      createAction: PropTypes.func.isRequired,
    };

    static defaultProps = {
      msg: ''
    };

    render() {
      const buttons = this.props.buttons.map((button, index) => (
        <Button label={button.text} key={index} onClick={this.props.createAction(button.action)} />
      ));

      return (
        <PureButtonCard message={this.props.msg}>
          {buttons}
        </PureButtonCard>
      );
    }
}
