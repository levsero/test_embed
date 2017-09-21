import React from 'react';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

const Reopened = () => {
  const successMessage = i18n.t('embeddable_framework.automaticAnswers.desktop.solve.re-opened', {
    fallback: 'Your request has been re-opened'
  });

  return (
    <p className='AutomaticAnswersMobile-message u-textCenter u-posRelative u-marginVL'>
      <Icon
        type='Icon--reopened-small'
        className='u-paddingAN u-posRelative u-marginRS u-inlineBlock u-isSuccessful' />
      <span>{successMessage}</span>
    </p>
  );
};

export default Reopened;
