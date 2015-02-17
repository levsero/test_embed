/** @jsx React.DOM */

module React from 'react/addons';

require('imports?_=lodash!lodash');

var HelpCenterArticle = React.createClass({
  componentDidUpdate() {
    var container = this.refs.article.getDOMNode();

    if (this.props.activeArticle.body) {
      container.innerHTML = this.props.activeArticle.body;
    }
  },

  render() {
    return (
      /* jshint quotmark:false */
      <div
        ref='article'
        className='UserContent u-marginTM'
      />
    );
  }
});

export { HelpCenterArticle };

