/** @jsx React.DOM */

module React from 'react/addons';

require('imports?_=lodash!lodash');

var classSet = React.addons.classSet;

var HelpCenterArticle = React.createClass({
	render() {
		var articleClasses = classSet({
          'u-isHidden': !this.props.articleView,
          'u-marginTM': true,
          'Content': true
        });

    return (
    	<div
    		style={{maxWidth: '100%', wordWrap: 'break-word'}}
    		className={articleClasses}
    		dangerouslySetInnerHTML={{ __html: (this.props.topics.length && this.props.topics[this.props.activeArticleId].body) ? this.props.topics[this.props.activeArticleId].body : '' }} />
    );
  }
});

export { HelpCenterArticle };

