/** @jsx React.DOM */

module React from 'react/addons';

import { i18n } from 'service/i18n';

require('imports?_=lodash!lodash');

var classSet = React.addons.classSet;

var HelpCenterArticle = React.createClass({
  componentDidUpdate() {
    var container = this.refs.article.getDOMNode();

    if (this.props.activeArticle.body) {
      container.innerHTML = this.props.activeArticle.body;
    }
  },

  render() {
    var userContentClasses = classSet({
          'UserContent u-marginVM': true,
          'UserContent--mobile u-paddingTM': this.props.fullscreen
        });

    return (
      /* jshint quotmark:false, camelcase:false */
      <div className={userContentClasses}>
        <h2>{this.props.activeArticle.title}</h2>
        <div
          ref='article'
          className='UserContent-article u-marginTM'
        />
        <div className='UserContent-viewArticleLink u-marginTS'>
          <div className='UserContent-viewArticleLink topBorder u-paddingBS' />
          <a
            href={this.props.activeArticle.html_url}
            target='_blank'>
              {i18n.t('embeddable_framework.helpCenter.article.viewLinkText', {
                fallback: 'View original article'
              })}
          </a>
        </div>
      </div>
    );
  }
});

export { HelpCenterArticle };

