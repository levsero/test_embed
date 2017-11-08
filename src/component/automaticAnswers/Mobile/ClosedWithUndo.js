import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

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

    const submittingStyles = isSubmitting ? `AutomaticAnswersAnchor--disabled` : '';
    const undoClasses = `AutomaticAnswersAnchor ${submittingStyles} u-textUppercase `;

    return (
      <p className='AutomaticAnswersMobile-message u-textCenter u-posRelative u-marginVM'>
        <Icon
          type='Icon--circleTick-small'
          className='u-paddingAN u-posRelative u-marginRS u-inlineBlock u-isSuccessful' />
        <span>
          {successMessage + ' '}
          <a
            className={undoClasses}
            onClick={e => handleUndo(e)}>
            {undo}
          </a>
        </span>
      </p>
    );
  };
}

ClosedWithUndo.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  handleUndo: PropTypes.func.isRequired,
  closeFrameAfterDelay: PropTypes.func.isRequired
};

export default ClosedWithUndo;
