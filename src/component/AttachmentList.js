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
    const { attachments, numAttachments } = this.state;

    let nextId = _.size(attachments) + 1;

    const newFiles = files.map((file) => {
      const fileObj = {
        id: nextId,
        file: file
      };

      nextId++;

      return fileObj;
    });

    this.setState({
      attachments: _.union(attachments, newFiles),
      numAttachments: numAttachments + files.length
    });
  }

  handleRemoveAttachment(attachmentId) {
    const { attachments, numAttachments } = this.state;

    _.find(attachments, (a) => a.id === attachmentId).file = null;

    this.setState({
      attachments,
      numAttachments: numAttachments - 1
    });
  }

  renderAttachments() {
    const { attachments } = this.state;
    const { attachmentSender } = this.props;

    return _.map(attachments, (attachment) => {
      const { file } = attachment;

      if (file && file.name && file.name.indexOf('.') > -1) {
        const extension = file.name.split('.').pop();
        const icon = iconMapper[extension] || 'Icon--preview-default';

        return (
          <Attachment
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
    const { numAttachments } = this.state;

    const attachmentComponents = this.renderAttachments();
    const title = (numAttachments > 0)
                ? i18n.t('embeddable_framework.submitTicket.attachments.title_withCount',
                    { fallback: 'Attachments (%(count)s)',
                    count: numAttachments }
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
