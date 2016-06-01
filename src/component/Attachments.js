import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { AttachmentPreview } from 'component/AttachmentPreview';
import { ButtonDropzone } from 'component/Button';
import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';

const iconMapper = {
  'pdf': 'Icon--preview-pdf',
  'img': 'Icon--preview-img',
  'png': 'Icon--preview-img',
  'gif': 'Icon--preview-img',
  'jpeg': 'Icon--preview-img',
  'jpg': 'Icon--preview-img',
  'docx': 'Icon--preview-doc',
  'doc': 'Icon--preview-doc',
  'key': 'Icon--preview-key',
  'numbers': 'Icon--preview-num',
  'pptx': 'Icon--preview-ppt',
  'ppt': 'Icon--preview-ppt',
  'pages': 'Icon--preview-pag',
  'rtf': 'Icon--preview-txt',
  'txt': 'Icon--preview-txt',
  'xlsx': 'Icon--preview-xls',
  'xls': 'Icon--preview-xls'
};

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

  renderAttachments() {
    const { attachments } = this.state;
    const { attachmentSender } = this.props;

    const previews = _.map(attachments, (attachment) => {
      const extension = attachment.name.split('.').pop();
      const icon = iconMapper[extension] || 'Icon--preview-default';

      return (<AttachmentPreview
               attachment={attachment}
               handleRemoveAttachment={this.removeAttachment}
               attachmentSender={attachmentSender}
               icon={icon} />);
    });

    return previews;
  }

  render() {
    const { fullscreen, attachmentSender } = this.props;
    const { attachments } = this.state;

    const attachmentComponents = this.renderAttachments();
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
          {attachmentComponents}
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
