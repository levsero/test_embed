import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { ButtonCard as PureButtonCard } from 'component/shared/StructuredMessage/ButtonCard';
import { Button, ButtonSchemaPropType } from './Button';

import { locals as styles } from './ButtonCard.scss';

export class ButtonCard extends Component {
    static propTypes = {
      ...ButtonCard.schemaPropTypes,
      // Other props
      createAction: PropTypes.func.isRequired,
      className: PropTypes.string,
      isMobile: PropTypes.bool
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

      const cardClassName = classnames({
        [styles.mobile]: this.props.isMobile
      });

      return (
        <PureButtonCard message={this.props.msg} className={cardClassName}>
          {buttons}
        </PureButtonCard>
      );
    }
}
