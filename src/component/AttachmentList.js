import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { Attachment } from 'component/Attachment';
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

export class AttachmentList extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, AttachmentList.prototype);

    this.state = {
      attachments: [],
      numAttachments: 0
    };
  }

  handleOnDrop(files) {
    const { attachments } = this.state;

    const newFiles = files.map((file) => {
      return {
        id: _.uniqueId(),
        file: file
      };
    });

    this.setState({
      attachments: _.union(attachments, newFiles)
    });
  }

  handleRemoveAttachment(attachmentId) {
    const { attachments } = this.state;

    this.setState({
      attachments: _.reject(attachments, (a) => a.id === attachmentId)
    });
  }

  renderAttachments() {
    const { attachments } = this.state;
    const { attachmentSender } = this.props;

    return _.map(attachments, (attachment) => {
      const { id, file } = attachment;

      if (file && file.name && file.name.indexOf('.') > -1) {
        const extension = file.name.split('.').pop();
        const icon = iconMapper[extension] || 'Icon--preview-default';

        return (
          <Attachment
            key={id}
            attachment={attachment}
            handleRemoveAttachment={this.handleRemoveAttachment}
            attachmentSender={attachmentSender}
            icon={icon} />
        );
      }
    });
  }

  render() {
    const { fullscreen } = this.props;
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

AttachmentList.propTypes = {
  attachmentSender: PropTypes.func.isRequired,
  fullscreen: PropTypes.bool
};

AttachmentList.defaultProps = {
  fullscreen: false
};
