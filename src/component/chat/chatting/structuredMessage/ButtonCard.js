import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonCard as PureButtonCard } from 'component/shared/StructuredMessage/ButtonCard';
import { Button, ButtonSchemaPropType } from './Button';

export class ButtonCard extends Component {
    static propTypes = {
      ...ButtonCard.schemaPropTypes,
      // Other props
      createAction: PropTypes.func.isRequired,
      className: PropTypes.string
    };

    static defaultProps = {
      msg: ''
    };

    static schemaPropTypes = {
      buttons: PropTypes.arrayOf(ButtonSchemaPropType).isRequired,
      msg: PropTypes.string
    };

    render() {
      const { createAction } = this.props;

      const buttons = this.props.buttons.map((button, index) => (
        <Button {...button} key={index} createAction={createAction} />
      ));

      return (
        <PureButtonCard message={this.props.msg} className={this.props.className}>
          {buttons}
        </PureButtonCard>
      );
    }
}
