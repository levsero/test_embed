/** @jsx React.DOM */

module React from 'react/addons';

import { i18n } from 'service/i18n';

require('imports?_=lodash!lodash');

var sanitizeHtml = require('sanitize-html'),
    classSet = React.addons.classSet;

var HelpCenterArticle = React.createClass({
  componentDidUpdate() {
    var container = this.refs.article.getDOMNode(),
        sanitizeHtmlOptions = {
          allowedTags: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'span',
            'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'hr', 'br', 'div'
          ],
          allowedAttributes: {
            'a': [ 'href' ],
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
  },

  handleClick(e) {
    if(e.target.nodeName === 'A' && e.target.getAttribute('href').substr(0,1) === '#') {
      console.log(e)
      e.preventDefault();
    }
  },

  render() {
    var userContentClasses = classSet({
          'UserContent u-paddingTM u-paddingRS': true,
          'UserContent--mobile u-paddingTM': this.props.fullscreen,
          'UserContent--scroll': !this.props.fullscreen
        }),
        barClasses = classSet({
          'Form-cta u-cf Container-pullout u-paddingBS': true,
          'Form-cta--bar u-paddingBL': !this.props.fullscreen
        }),
        articleLocale = this.props.activeArticle.locale,
        baseUrl = `https://${document.zendeskHost}/hc/${articleLocale}/`;

    return (
      /* jshint quotmark:false, camelcase:false */
      <div>
        <base href={baseUrl} />
        <div className={barClasses} />
        <div className='u-nbfcAlt'>
          <div className={userContentClasses}>
            <h1>{this.props.activeArticle.title}</h1>
            <div
              ref='article'
              className='u-marginTM'
            />
            <a
              href={this.props.activeArticle.html_url}
              className='UserContent-viewArticleLink u-marginBM u-block'
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

