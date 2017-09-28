import React from 'react';

import { i18n } from 'service/i18n';

const UndoError = () => {
  const errorMessageLine1 = i18n.t(
    'embeddable_framework.automaticAnswers.label.error_re_open_line1',
    { fallback: 'There was a problem re-opening your request' }
  );
  const errorMessageLine2 = i18n.t(
    'embeddable_framework.automaticAnswers.label.error_re_open_line2',
    { fallback: 'Please contact us to re-open your request' }
  );

  return (
    <div className='AutomaticAnswersCallout AutomaticAnswersCallout--error u-marginVL'>
      <strong className='AutomaticAnswersCallout__title'>
        <span dir='ltr'>{errorMessageLine1}</span>
      </strong>
      <p className='AutomaticAnswersCallout__paragraph'>
        {errorMessageLine2}
      </p>
    </div>
  );
};

export default UndoError;
