import 'utility/i18nTestHelper';
import { render } from 'react-testing-library';
import React from 'react';

import { SubmitTicketForm } from '../SubmitTicketForm';

const renderSubmitTicketForm = (props) => {
  const defaultProps = {
    attachmentSender: noop,
    getFrameContentDocument: noop,
    submit: noop
  };

  const mergedProps = { ...defaultProps, ...props };

  return render(
    <SubmitTicketForm {...mergedProps}/>
  );
};

describe('render', () => {
  it('renders scrollContainer without footer when attachments and ticket fields are false', () => {
    const { container } = renderSubmitTicketForm();

    expect(container.querySelector('footer').className)
      .not.toContain('footerShadow');
  });

  it('renders scrollContainer with footer when attachments are true', () => {
    const { container } = renderSubmitTicketForm({
      attachmentsEnabled: true
    });

    expect(container.querySelector('footer').className)
      .toContain('footerShadow');
  });

  it('renders scrollContainer with footer when ticket fields are true', () => {
    const { container } = renderSubmitTicketForm({
      ticketFields: [1, 2, 3]
    });

    expect(container.querySelector('footer').className)
      .toContain('footerShadow');
  });
});
