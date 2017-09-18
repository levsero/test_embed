import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { i18n } from 'service/i18n';
import { Icon } from 'component/Icon';

class ClosedWithUndo extends Component {
  componentDidMount() {
    this.props.closeFrameAfterDelay();
  }

  render = () => {
    const { isSubmitting, handleUndo } = this.props;

    const successMessage = i18n.t('embeddable_framework.automaticAnswers.desktop.solve.closed', {
      fallback: 'Your request has been closed'
    });

    const undo = i18n.t('embeddable_framework.automaticAnswers.desktop.solve.undo', {
      fallback: 'UNDO'
    });

    const undoClasses = classNames({
      'AutomaticAnswersAnchor': true,
      'AutomaticAnswersAnchor--disabled': isSubmitting
    });

    return (
      <p className='AutomaticAnswersDesktop-message u-textCenter u-marginVL'>
        <Icon type='Icon--circleTick-large' className='u-paddingAN u-isSuccessful u-paddingBS'/>
        <span>
          {successMessage + ' '}
          <a
            className={undoClasses}
            onClick={(e) => handleUndo(e)}>
            {undo}
          </a>
        </span>
      </p>
    );
  }
}

ClosedWithUndo.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  handleUndo: PropTypes.func.isRequired,
  closeFrameAfterDelay: PropTypes.func.isRequired
};

export default ClosedWithUndo;
