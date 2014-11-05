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
      buttonLabel: i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket'),
      fullscreen: isMobileBrowser(),
      previousSearchTerm: '',
      hasSearched: false,
      searchFailed: false
    };
  },

  focusField() {
    if (!isMobileBrowser()) {
      this.refs.searchField.focus();
    }
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
      hasSearched: true,
      searchFailed: false
    });
  },

  searchFail() {
    this.setState({
      isLoading: false,
      previousSearchTerm: this.state.searchTerm,
      hasSearched: true,
      searchFailed: true
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
        done: (res) => {
          if (res.ok) {
            this.updateResults(res);
          } else {
            this.searchFail();
          }
        },
        fail: () => this.searchFail()
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

  searchNoResultsTitle() {
    if (this.state.searchFailed) {
      return i18n.t('embeddable_framework.helpCenter.search.error.title', {
        fallback: 'Sorry, no results available at the moment'
      });
    } else {
      return i18n.t('embeddable_framework.helpCenter.search.noResults.title', {
        searchTerm: this.state.previousSearchTerm,
        fallback: `Uh oh, there are no results for "${this.state.previousSearchTerm}"`
      });
    }
  },

  searchNoResultsBody() {
    if (this.state.searchFailed) {
      return i18n.t('embeddable_framework.helpCenter.search.error.body', {
        fallback: 'Use the button below to send us a message'
      });
    } else {
      return i18n.t('embeddable_framework.helpCenter.search.noResults.body', {
        fallback: 'Try searching for something else'
      });
    }
  },

  render() {
    /* jshint quotmark:false */
    var topicTemplate = function(topic) {
        return (
            /* jshint camelcase:false */
            <li key={_.uniqueId('topic_')} className={listItemClasses}>
              <a className='custom-textColor' href={topic.html_url} target='_blank' onClick={this.props.onLinkClick}>
                  {topic.title || topic.name}
              </a>
            </li>
            );
        },
        listClasses = classSet({
          'List': true,
          'u-isHidden': !this.state.topics.length,
          'u-borderNone u-marginBS List--fullscreen': this.state.fullscreen
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
          'Form-cta--title u-textSizeMed Arrange Arrange--middle u-textBody': true,
          'u-textSizeBaseMobile': this.state.fullscreen,
          'u-isHidden': !this.state.topics.length
        }),
        noResultsClasses = classSet({
          'u-marginTM u-textCenter u-textSizeMed': true,
          'u-isHidden': this.state.resultCount || !this.state.hasSearched,
          'u-textSizeBaseMobile': this.state.fullscreen,
          'u-borderBottom List--noResults': !this.state.fullscreen
        }),
        formClasses = classSet({
          'u-nbfc': true,
          'Container-pullout': !this.state.fullscreen
        }),
        searchTitleClasses = classSet({
          'u-textSizeBaseMobile u-marginTM u-textCenter': true,
          'u-isHidden': !this.state.fullscreen || this.state.hasSearched,
          'Container--fullscreen-center-vert': !this.state.searchFieldFocused
        }),
        linkClasses = classSet({
          'u-textSizeBaseMobile u-textCenter u-marginTL': true,
          'u-isHidden': !this.state.fullscreen || this.state.hasSearched
        }),
        noResultsParagraphClasses = classSet({
          'u-textSecondary': true,
          'u-marginBL': !this.state.fullscreen
        }),
        logoUrl = ['//www.zendesk.com/lp/just-one-click/',
          '?utm_source=launcher&utm_medium=poweredbyzendesk&utm_campaign=image'
        ].join(''),
        linkLabel,
        linkContext,
        onFocus = function() {
          this.setState({searchFieldFocused: true});
        }.bind(this),
        chatButtonLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.chat');

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(0, 10), 0);
    }

    if (this.state.buttonLabel === chatButtonLabel) {
      linkContext = i18n.t('embeddable_framework.helpCenter.label.linkContext.chat', {
          fallback: 'Need more specific help?'
      });
      linkLabel = i18n.t('embeddable_framework.helpCenter.label.link.chat', {
          fallback: 'Chat with us'
      });
    } else {
      linkContext = i18n.t('embeddable_framework.helpCenter.label.linkContext.submitTicket', {
          fallback: 'Do you have a specific question?'
      });
      linkLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket', {
          fallback: 'Leave us a message'
      });
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
          buttonLabel={this.state.buttonLabel}
          onButtonClick={this.props.onButtonClick}
          onSubmit={this.handleSubmit}>
          <h1 className={searchTitleClasses}>
            {i18n.t('embeddable_framework.helpCenter.label.searchHelpCenter', {
              fallback: 'Search our Help Center'
            })}
          </h1>
          <SearchField
            ref='searchField'
            fullscreen={this.state.fullscreen}
            onFocus={onFocus}
            hasSearched={this.state.hasSearched}
            isLoading={this.state.isLoading} />
          <div className={linkClasses}>
            <p className='u-marginBN'>{linkContext}</p>
            <a className='custom-textColor' onClick={this.props.onButtonClick}>
              {linkLabel}
            </a>
          </div>
          <h1 className={formLegendClasses}>
            <span className='Arrange-sizeFill'>
              {i18n.t('embeddable_framework.helpCenter.label.results')}
            </span>
          </h1>
          <div className={noResultsClasses} id='noResults'>
            <p className='u-marginBN u-marginTL'>
              {this.searchNoResultsTitle()}
            </p>
            <p className={noResultsParagraphClasses}>
              {this.searchNoResultsBody()}
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
