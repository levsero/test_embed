/** @jsx React.DOM */

module React from 'react/addons';

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
    /* jshint quotmark:false */
    var articleClasses = classSet({
          'u-isHidden': !this.props.articleViewActive,
          'u-marginTM': true,
          'Content': true
        });

    return (
      /* jshint laxbreak: true */
      <div
        ref='article'
        style={{maxWidth: '100%', wordWrap: 'break-word'}}
        className={articleClasses}
      />
    );
  }
});

export { HelpCenterArticle };

