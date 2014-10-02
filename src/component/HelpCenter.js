/** @jsx React.DOM */

module React from 'react/addons';

import { transport }       from 'service/transport';
import { stopWordsFilter } from 'mixin/searchFilter';
import { HelpCenterForm }  from 'component/HelpCenterForm';
import { SearchField }     from 'component/FormField';
import { isMobileBrowser } from 'utility/devices';
import { i18n }            from 'service/i18n';

require('imports?_=lodash!lodash');

var classSet = React.addons.classSet;

export var HelpCenter = React.createClass({
  getInitialState() {
    return {
      topics: [],
      resultCount: 0,
      searchTerm: '',
      fullscreen: isMobileBrowser(),
      hasSearched: false
    };
  },

  focusField() {
    this.refs.searchField.focus();
  },

  getViewAllUrl() {
    return `https://${this.props.zendeskHost}/hc/search?query=${this.state.searchTerm}`;
  },

  handleSubmit(e) {
    e.preventDefault();
    this.handleSearch(true);
  },

  updateResults(res) {
    var json = res.body,
        topics = json.results;

    this.setState({
      topics: topics,
      resultCount: json.count,
      isLoading: false,
      previousSearchTerm: this.state.searchTerm,
      hasSearched: true
    });
  },

  performSearch(searchString) {
    this.props.onSearch(searchString);
    this.setState({
      isLoading: true,
      searchTerm: searchString
    });

    transport.send({
      method: 'get',
      path: '/embeddable/proxy',
      query: {
        query: searchString,
        /* jshint camelcase:false */
        zendesk_path: '/api/v2/help_center/search.json'
      },
      callbacks: {
        done: this.updateResults
      }
    });
  },

  handleSearch(forceSearch) {
    var filteredStr,
        searchString = this.refs.searchField.getValue();

    if (_.isEmpty(searchString)) {
      return;
    }

    if (searchString.length >= 5 && _.last(searchString) === ' ' || forceSearch) {
      filteredStr = stopWordsFilter(searchString);

      if (filteredStr !== '') {
        this.performSearch(filteredStr);
      }
    }
  },

  render() {
    /* jshint quotmark:false */
    var topicTemplate = function(topic) {
        return (
            /* jshint camelcase:false */
            <li key={_.uniqueId('topic_')} className={listItemClasses}>
              <a href={topic.html_url} target='_blank' onClick={this.props.onLinkClick}>
                  {topic.title || topic.name}
              </a>
            </li>
            );
        },
        listClasses = classSet({
          'List': true,
          'u-isHidden': !this.state.topics.length,
          'u-borderNone u-marginBS': this.state.fullscreen
        }),
        listItemClasses = classSet({
          'List-item': true,
          'u-textSizeMed': !this.state.fullscreen,
          'u-textSizeBaseMobile': this.state.fullscreen
        }),
        containerClasses = classSet({
          'Container': true,
          'Container--popover u-nbfcAlt': !this.state.fullscreen,
          'Container--fullscreen': this.state.fullscreen,
          'u-posRelative': true
        }),
        containerBarClasses = classSet({
          'Container-bar Container-pullout u-borderBottom': true,
          'u-isHidden': !this.state.fullscreen
        }),
        logoClasses = classSet({
          'Icon Icon--zendesk u-linkClean': true,
          'u-posAbsolute': !this.state.fullscreen || this.state.showNotification,
          'u-posStart u-posEnd--vert': !this.state.fullscreen || this.state.showNotification,
        }),
        formLegendClasses = classSet({
          'u-textSizeMed u-marginT24 Arrange Arrange--middle u-textBody': true,
          'u-textSizeBaseMobile': this.state.fullscreen,
          'u-isHidden': !this.state.topics.length
        }),
        noResultsClasses = classSet({
          'u-marginTM u-marginB14 u-textCenter u-borderBottom u-textSizeMed': true,
          'u-isHidden': this.state.resultCount || !this.state.hasSearched
        }),
        formClasses = classSet({
          'u-nbfc': true,
          'Container-pullout': !this.state.fullscreen
        }),
        logoUrl = ['//www.zendesk.com/lp/just-one-click/',
          '?utm_source=launcher&utm_medium=poweredbyzendesk&utm_campaign=image'
        ].join('');

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(0, 10), 0);
    }

    return (
      /* jshint laxbreak: true */
      <div className={containerClasses}>
        <div className={containerBarClasses} />
        <HelpCenterForm
          fullscreen={this.state.fullscreen}
          ref='helpCenterForm'
          className={formClasses}
          onSearch={this.handleSearch}
          isLoading={this.state.isLoading}
          hasSearched={this.state.hasSearched}
          onButtonClick={this.props.onButtonClick}
          onSubmit={this.handleSubmit}>
          <SearchField
            ref='searchField'
            fullscreen={this.state.fullscreen}
            hasSearched={this.state.hasSearched}
            isLoading={this.state.isLoading} />
          <h1 className={formLegendClasses}>
            <span className='Arrange-sizeFill'>
              {i18n.t('embeddable_framework.helpCenter.label.results')}
            </span>
          </h1>
          <div className={noResultsClasses}>
            <p className='u-marginBN u-marginTL'>
              {i18n.t('embeddable_framework.helpCenter.label.noResults', {
                searchTerm: this.state.previousSearchTerm,
                fallback: 'Uh oh, there are no results for \"'
                  + this.state.previousSearchTerm
                  + '\"'
               })}
            </p>
            <p className='u-textSecondary u-marginBL'>
              {i18n.t('embeddable_framework.helpCenter.paragraph.noResults', {
                fallback: 'Try searching for something else'
              })}
            </p>
          </div>
          <ul className={listClasses}>
            {_.chain(this.state.topics).first(3).map(topicTemplate.bind(this)).value()}
          </ul>
        </HelpCenterForm>
        <div className='u-nbfc'>
          <a
            href={logoUrl}
            target='_blank'
            className={logoClasses}>
            <span className='u-isHiddenVisually'>zendesk</span>
          </a>
        </div>
      </div>
    );
  }
});
