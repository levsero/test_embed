import React from 'react/addons';

import { i18n } from 'service/i18n';

const sanitizeHtml = require('sanitize-html');
const classSet = React.addons.classSet;

var HelpCenterArticle = React.createClass({
  propTypes: {
    activeArticle: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      lastActiveArticleId: 0
    };
  },

  componentDidUpdate() {
    const container = this.refs.article.getDOMNode();
    const sanitizeHtmlOptions = {
      allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'span',
        'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'hr', 'br', 'div',
        'sup', 'sub', 'img'
      ],
      allowedAttributes: {
        'a': ['href', 'target', 'title', 'name'],
        'span': ['name'],
        'div': ['id'],
        'img': ['src', 'alt']
      },
      allowedClasses: {
        'span': [
          'wysiwyg-font-size-x-large',
          'wysiwyg-font-size-large',
          'wysiwyg-font-size-small'
        ]
      }
    };

    if (this.props.activeArticle.body) {
      let cleanHtml = sanitizeHtml(this.props.activeArticle.body, sanitizeHtmlOptions);
      container.innerHTML = cleanHtml;
    }

    if (this.state.lastActiveArticleId !== this.props.activeArticle.id) {
      let topNode = this.refs.userContent.getDOMNode();
      topNode.scrollTop = 0;

      this.setState({
        lastActiveArticleId: this.props.activeArticle.id
      });
    }
  },

  componentDidMount() {
    const doc = this.getDOMNode().ownerDocument;
    const base = doc.createElement('base');

    base.href = `https://${document.zendeskHost}`;

    doc.head.appendChild(base);
  },

  handleClick(e) {
    const target = e.target;
    const nodeName = target.nodeName;
    const href = target.getAttribute('href');
    const doc = target.ownerDocument;

    if (nodeName === 'A' && href.indexOf('#') === 0) {
      // You can deep link via an id or name attribute, handle both in the selector
      let inPageElem = doc.querySelector(`${href},[name="${href.slice(1)}"]`);

      if (inPageElem) {
        inPageElem.scrollIntoView();
      }
      e.preventDefault();
    } else {
      target.setAttribute('target', '_blank');
    }
  },

  render() {
    const userContentClasses = classSet({
      'UserContent u-paddingTM u-paddingRS u-marginTM u-userLinkColor': true,
      'UserContent--mobile': this.props.fullscreen,
      'UserContent--scroll': !this.props.fullscreen
    });
    const barClasses = classSet({
      'Form-cta u-cf Container-pullout': true,
      'Form-cta--bar': !this.props.fullscreen,
      'u-isHidden': this.props.fullscreen
    });

    return (
      /* jshint quotmark:false, camelcase:false, maxlen: false */
      <div>
        <div className={barClasses} />
        <div className={userContentClasses} ref='userContent'>
          <h1>{this.props.activeArticle.title}</h1>
          <div
            ref='article'
            className='u-marginTM'
            onClick={this.handleClick}
            onTouchStart={this.handleClick}
          />
          <div className='u-marginBM UserContent-viewArticleLink'>
            <a
              href={this.props.activeArticle.html_url} // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
              target='_blank'>
              {i18n.t('embeddable_framework.helpCenter.article.viewLinkText', {
                fallback: 'View original article'
              })}
            </a>
          </div>
        </div>
      </div>
    );
  }
});

export { HelpCenterArticle };

