/** @jsx React.DOM */

module React from 'react/addons';

import { i18n } from 'service/i18n';

require('imports?_=lodash!lodash');

var sanitizeHtml = require('sanitize-html'),
    classSet = React.addons.classSet;

var HelpCenterArticle = React.createClass({
  propTypes: {
    activeArticle: React.PropTypes.object.isRequired,
    activeArticleIndex: React.PropTypes.number.isRequired,
    lastActiveArticleIndex: React.PropTypes.number.isRequired
  },

  componentDidUpdate() {
    var container = this.refs.article.getDOMNode(),
        sanitizeHtmlOptions = {
          allowedTags: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'span',
            'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'hr', 'br', 'div'
          ],
          allowedAttributes: {
            'a': [ 'href', 'target', 'title' ],
            'div': [ 'id' ]
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

    if (this.props.lastActiveArticleIndex !== this.props.activeArticleIndex) {
      var topNode = this.refs.userContent.getDOMNode();
      topNode.scrollTop = 0;
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

    if (nodeName === 'A') {
      if (href.indexOf('#') === 0) {
        let inPageElem = doc.querySelector(href);

        inPageElem.scrollIntoView();
        e.preventDefault();
      } else {
        target.setAttribute('target', '_blank');
      }
    }
  },

  render() {
    var userContentClasses = classSet({
          'UserContent u-paddingTM u-paddingRS u-userLinkColor': true,
          'UserContent--mobile u-paddingTM': this.props.fullscreen,
          'UserContent--scroll': !this.props.fullscreen
        }),
        barClasses = classSet({
          'Form-cta u-cf Container-pullout u-paddingBS': true,
          'Form-cta--bar u-paddingBL': !this.props.fullscreen
        });

    return (
      /* jshint quotmark:false, camelcase:false */
      <div>
        <div className={barClasses} />
        <div className='u-nbfcAlt'>
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
                href={this.props.activeArticle.html_url}
                target='_blank'>
                {i18n.t('embeddable_framework.helpCenter.article.viewLinkText', {
                  fallback: 'View original article'
                })}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export { HelpCenterArticle };

