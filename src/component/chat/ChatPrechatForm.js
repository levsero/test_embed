import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Field } from 'component/field/Field';
import { Button } from 'component/button/Button';

import { i18n } from 'service/i18n';

import { locals as styles } from './ChatBox.sass';

export class ChatPrechatForm extends Component {
  static propTypes = {
    onFormCompleted: PropTypes.func
  };

  static defaultProps = {
    onFormCompleted: () => {}
  };

  handleButtonClick = (e) => {
    e.preventDefault();

    this.props.onFormCompleted();
  }

  render = () => {
    return (
      <div className={styles.input}>
        <Field
          name='chatBox' />
        <Button
          label={i18n.t('embeddable_framework.chat.preChat.online.button.startChat')}
          disabled={false}
          onClick={this.handleButtonClick} />
      </div>
    );
  }
}
