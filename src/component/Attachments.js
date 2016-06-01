import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { getAttachmentPreviews } from 'component/AttachmentPreview';
import { ButtonDropzone } from 'component/Button';
import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';

export class Attachments extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, Attachments.prototype);

    this.state = {
      attachments: []
    };
  }

  handleOnDrop(files) {
    const attachments = _.union(this.state.attachments, files);

    this.setState({ attachments });
  }

  removeAttachment(attachment) {
    const idx = this.state.attachments.indexOf(attachment);

    this.state.attachments.splice(idx, 1);
    this.forceUpdate();
  }

  render() {
    const { fullscreen, attachmentSender } = this.props;
    const { attachments } = this.state;

    const previews = getAttachmentPreviews(attachments, this.removeAttachment, attachmentSender);
    const title = (attachments.length > 0)
                ? i18n.t('embeddable_framework.submitTicket.attachments.title_withCount',
                    { fallback: 'Attachments (%(count)s)',
                    count: attachments.length }
                  )
                : i18n.t('embeddable_framework.submitTicket.attachments.title',
                    { fallback: 'Attachments' }
                  );

    return (
      <div>
        <div className='Form-fieldContainer u-block u-marginVM'>
          <label className='Form-fieldLabel u-textXHeight'>
            {title}
          </label>
          {previews}
          <ButtonDropzone
            onDrop={this.handleOnDrop}
            isMobile={fullscreen} />
        </div>
      </div>
    );
  }
}

Attachments.propTypes = {
  attachmentSender: PropTypes.func.isRequired,
  fullscreen: PropTypes.bool,
  updateAttachments: PropTypes.func.isRequired
};

Attachments.defaultProps = {
  fullscreen: false
};
