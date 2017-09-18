import React from 'react';

import { i18n } from 'service/i18n';
import { Icon } from 'component/Icon';

const Reopened = () => {
  const successMessage = i18n.t('embeddable_framework.automaticAnswers.desktop.solve.re-opened', {
    fallback: 'Your request has been re-opened'
  });

  return (
    <p className='AutomaticAnswersDesktop-message u-textCenter u-marginVL'>
      <Icon type='Icon--reopened-large' className='u-paddingAN u-isSuccessful u-paddingBS'/>
      <span>{successMessage}</span>
    </p>
  );
};

export default Reopened;
