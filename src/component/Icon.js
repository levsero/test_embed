import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { isMobileBrowser } from 'utility/devices';

const icons = {
  'Icon--link': require('icons/widget-icon_link.svg'),
  'Icon--back': require('icons/widget-icon_back.svg'),
  'Icon--close': require('icons/widget-icon_close.svg'),
  'Icon--chat': require('icons/widget-icon_chat.svg'),
  'Icon--help': require('icons/widget-icon_help.svg'),
  'Icon--tick': require('icons/widget-icon_tick.svg'),
  'Icon--check': require('icons/widget-icon_checkboxCheck.svg'),
  'Icon--search': require('icons/widget-icon_search.svg'),
  'Icon--zendesk': require('icons/widget-icon_zendesk.svg'),
  'Icon--caret': require('icons/widget-icon_caret.svg'),
  'Icon--form': require('icons/widget-icon_form.svg'),
  'Icon--avatar': require('icons/widget-icon_avatar.svg'),
  'Icon--article': require('icons/widget-icon_article.svg'),
  'Icon--clearInput': require('icons/widget-icon_clearInput.svg'),
  'Icon--paperclip-small': require('icons/widget-icon_paperclip_small.svg'),
  'Icon--paperclip-medium': require('icons/widget-icon_paperclip_medium.svg'),
  'Icon--paperclip-large': require('icons/widget-icon_paperclip_large.svg'),
  'Icon': require('icons/widget-icon_help.svg'),
  'Icon--preview-doc': require('icons/attach_doc.svg'),
  'Icon--preview-img': require('icons/attach_img.svg'),
  'Icon--preview-key': require('icons/attach_key.svg'),
  'Icon--preview-num': require('icons/attach_num.svg'),
  'Icon--preview-pag': require('icons/attach_pag.svg'),
  'Icon--preview-pdf': require('icons/attach_pdf.svg'),
  'Icon--preview-ppt': require('icons/attach_ppt.svg'),
  'Icon--preview-txt': require('icons/attach_txt.svg'),
  'Icon--preview-default': require('icons/attach_unknown.svg'),
  'Icon--preview-xls': require('icons/attach_xls.svg')
};

export class Icon extends Component {
  render() {
    const icon = icons[this.props.type];
    const iconClasses = classNames({
      [`Icon ${this.props.type} ${this.props.className}`]: true,
      'is-mobile': this.props.isMobile
    });

    return (
      <span
        {...this.props}
        className={iconClasses}
        dangerouslySetInnerHTML={{__html: icon}} />
    );
  }
}

Icon.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  isMobile: PropTypes.bool
};

Icon.defaultProps = {
  type: '',
  className: '',
  isMobile: isMobileBrowser()
};
