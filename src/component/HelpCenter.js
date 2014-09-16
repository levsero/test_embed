/** @jsx React.DOM */

module React from 'react/addons';

import { transport }       from 'service/transport';
import { stopWordsFilter } from 'mixin/searchFilter';
import { HelpCenterForm }  from 'component/HelpCenterForm';
import { i18n }            from 'service/i18n';

require('imports?_=lodash!lodash');

var classSet = React.addons.classSet;

export var HelpCenter = React.createClass({
  getInitialState() {
    return {
      topics: [],
      searchTitle: i18n.t('embeddable_framework.helpCenter.label.default'),
      resultCount: 0,
      searchTerm: ''
    };
  },

  getViewAllUrl() {
    return `https://${this.props.zendeskHost}/hc/search?query=${this.state.searchTerm}`;
  },

  componentWillMount() {
    /* jshint camelcase:false */
    transport.send({
      method: 'get',
      path: '/embeddable/proxy',
      query: {
        include: 'translations',
        zendesk_path: '/api/v2/help_center/categories.json'
      },
      callbacks: {
        done: (data) => {
          var json = JSON.parse(data);

          this.setState({
            topics: _.first(json.categories, 3),
            resultCount: json.count
          });
        }
      }
    });
  },

  handleSubmit(e, data) {
    e.preventDefault();
    this.handleSearch(data.value, true);
  },

  updateResults(data) {
    var json = JSON.parse(data),
        topics = json.results,
        searchTitle;

    if (json.count) {
      searchTitle = i18n.t('embeddable_framework.helpCenter.label.results');
    } else {
      searchTitle = i18n.t('embeddable_framework.helpCenter.label.noResults', {
        fallback: 'Sorry, no results found'
      });
    }

    this.setState({
      topics: topics,
      searchTitle: searchTitle,
      resultCount: json.count,
      isLoading: false
    });
  },

  makeSearch(searchString) {
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

  handleSearch(searchString, isSubmit) {
    var filteredStr;

    if (_.isEmpty(searchString)) {
      return;
    }

    if (searchString.length >= 5 && _.last(searchString) === ' ' || isSubmit) {
      filteredStr = stopWordsFilter(searchString);

      if (filteredStr !== '') {
        this.makeSearch(filteredStr);
      }
    }
  },

  render() {
    /* jshint quotmark:false */
    var topicTemplate = function(topic) {
        return (
            /* jshint camelcase:false */
            <li key={_.uniqueId('topic_')} className='List-item'>
              <a href={topic.html_url} target='_blank'>
                  {topic.title || topic.name}
              </a>
            </li>
            );
        },
        listClasses = classSet({
          'List': true,
          'u-isHidden': !this.state.topics.length
        }),
        containerClasses = classSet({
          'Container': true,
          'Container--popover u-nbfcAlt': !this.state.fullscreen,
          'Container--fullscreen': this.state.fullscreen,
          'Arrange Arrange--middle': this.state.fullscreen,
          'u-posRelative': true
        }),
        logoClasses = classSet({
          'Icon Icon--zendesk u-linkClean': true,
          'u-posAbsolute': !this.state.fullscreen || this.state.showNotification,
          'u-posStart u-posEnd--vert': !this.state.fullscreen || this.state.showNotification,
        }),
        viewAllClasses = classSet({
          'Arrange-sizeFit u-textNormal u-textNoWrap': true,
          'u-isHidden': this.state.resultCount <= 3
        }),
        noResultsClasses = classSet({
          'u-textSizeMed u-marginTS u-marginBS': true,
          'u-isHidden': this.state.resultCount
        }),
        logoUrl = ['//www.zendesk.com/lp/just-one-click/',
          '?utm_source=launcher&utm_medium=poweredbyzendesk&utm_campaign=image'
        ].join('');

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(0, 10), 0);
    }

    return (
      <div className={containerClasses}>
        <HelpCenterForm
          ref='helpCenterForm'
          className='Container-pullout u-nbfc'
          onSearch={this.handleSearch}
          isLoading={this.state.isLoading}
          onButtonClick={this.props.onButtonClick}
          submit={this.handleSubmit}>
          <h1 className='Form-legend u-marginTS Arrange Arrange--middle'>
            <span className='Arrange-sizeFill'>{this.state.searchTitle}</span>
            <a
              href={this.getViewAllUrl()}
              className={viewAllClasses}
              target='_blank'>
              {
                i18n.t('embeddable_framework.helpCenter.label.showAll',{
                 count: this.state.resultCount
                })
              }
            </a>
          </h1>
          <p className={noResultsClasses}>
            {i18n.t('embeddable_framework.helpCenter.label.noResultsParagraph', {
              fallback: 'Try getting in touch below for more help.'
            })}
          </p>
          <ul className={listClasses}>
            {_.chain(this.state.topics).first(3).map(topicTemplate).value()}
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
