import React from 'react/addons';

import { i18n } from 'service/i18n';
import { ButtonPill } from 'component/Button';

var sanitizeHtml = require('sanitize-html'),
    classSet = React.addons.classSet;

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
    var container = this.refs.article.getDOMNode(),
        sanitizeHtmlOptions = {
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
        },
        cleanHtml;

    if (this.props.activeArticle.body) {
      cleanHtml = sanitizeHtml(this.props.activeArticle.body, sanitizeHtmlOptions);
      container.innerHTML = cleanHtml;
    }

    if (this.state.lastActiveArticleId !== this.props.activeArticle.id) {
      var topNode = this.refs.userContent.getDOMNode();
      topNode.scrollTop = 0;

      this.setState({
        lastActiveArticleId: this.props.activeArticle.id
      });
    }
  },

  componentDidMount() {
    var doc = this.getDOMNode().ownerDocument,
        base = doc.createElement('base');

    base.href = `https://${document.zendeskHost}`;

    doc.head.appendChild(base);
  },

  handleClick(e) {
    var target = e.target,
        nodeName = target.nodeName,
        href = target.getAttribute('href'),
        doc = target.ownerDocument;

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
    var userContentClasses = classSet({
          'UserContent u-userLinkColor': true
        });

    return (
      /* jshint quotmark:false, camelcase:false */
      <div>
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
              className='u-linkClean'
              href={this.props.activeArticle.html_url}
              target='_blank'>
              <ButtonPill
                fullscreen={this.props.fullscreen}
                label={i18n.t('embeddable_framework.helpCenter.article.viewLinkText')}
              />
            </a>
          </div>
        </div>
      </div>
    );
  }
});

export { HelpCenterArticle };

