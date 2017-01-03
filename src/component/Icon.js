import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { isMobileBrowser } from 'utility/devices';

const icons = {
  'Icon': require('icons/widget-icon_help.svg'),
  'Icon--article': require('icons/widget-icon_article.svg'),
  'Icon--avatar': require('icons/widget-icon_avatar.svg'),
  'Icon--back': require('icons/widget-icon_back.svg'),
  'Icon--caret': require('icons/widget-icon_caret.svg'),
  'Icon--chat': require('icons/widget-icon_chat.svg'),
  'Icon--check': require('icons/widget-icon_checkboxCheck.svg'),
  'Icon--clearInput': require('icons/widget-icon_clearInput.svg'),
  'Icon--close': require('icons/widget-icon_close.svg'),
  'Icon--form': require('icons/widget-icon_form.svg'),
  'Icon--help': require('icons/widget-icon_help.svg'),
  'Icon--link': require('icons/widget-icon_link.svg'),
  'Icon--paperclip-large': require('icons/widget-icon_paperclip_large.svg'),
  'Icon--paperclip-medium': require('icons/widget-icon_paperclip_medium.svg'),
  'Icon--paperclip-small': require('icons/widget-icon_paperclip_small.svg'),
  'Icon--preview-default': require('icons/attach_unknown.svg'),
  'Icon--preview-doc': require('icons/attach_doc.svg'),
  'Icon--preview-img': require('icons/attach_img.svg'),
  'Icon--preview-key': require('icons/attach_key.svg'),
  'Icon--preview-num': require('icons/attach_num.svg'),
  'Icon--preview-pag': require('icons/attach_pag.svg'),
  'Icon--preview-pdf': require('icons/attach_pdf.svg'),
  'Icon--preview-ppt': require('icons/attach_ppt.svg'),
  'Icon--preview-txt': require('icons/attach_txt.svg'),
  'Icon--preview-xls': require('icons/attach_xls.svg'),
  'Icon--search': require('icons/widget-icon_search.svg'),
  'Icon--tick-inline': require('icons/widget-icon_tick.svg'),
  'Icon--tick': require('icons/widget-icon_tick.svg'),
  'Icon--zendesk': require('icons/widget-icon_zendesk.svg')
};

export class Icon extends Component {
  static propTypes = {
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    onClick: PropTypes.func,
    type: PropTypes.string
  };

  static defaultProps = {
    className: '',
    isMobile: isMobileBrowser(),
    onClick: () => {},
    type: ''
  };

  render = () => {
    const icon = icons[this.props.type];
    const iconClasses = classNames({
      [`Icon ${this.props.type} ${this.props.className}`]: true,
      'is-mobile': this.props.isMobile
    });

    return (
      <span
        onClick={this.props.onClick}
        className={iconClasses}
        type={this.props.type}
        dangerouslySetInnerHTML={{__html: icon}} />
    );
  }
}
