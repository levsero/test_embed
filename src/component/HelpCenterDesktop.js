import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import { HelpCenterArticle } from 'component/HelpCenterArticle';
import { SearchField } from 'component/FormField';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { ScrollContainer } from 'component/ScrollContainer';
import { i18n } from 'service/i18n';
import { Button,
         ButtonGroup } from 'component/Button';
import { bindMethods } from 'utility/utils';

export class HelpCenterDesktop extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, HelpCenterDesktop.prototype);
  }

  focusField() {
    if (!this.props.parentState.articleViewActive) {
      const searchFieldInputNode = ReactDOM.findDOMNode(this.refs.searchField.refs.searchFieldInput);
      const strLength = searchFieldInputNode.value.length;

      this.refs.searchField.focus();
      if (searchFieldInputNode.setSelectionRange) {
        searchFieldInputNode.setSelectionRange(strLength, strLength);
      }
    }
  }

  render() {
    const listClasses = classNames({
      'List': true,
      'u-isHidden': !this.props.parentState.articles.length || this.props.parentState.articleViewActive
    });
    const formLegendClasses = classNames({
      'u-paddingTT u-textSizeNml Arrange Arrange--middle u-textBody': true,
      'u-isHidden': !this.props.parentState.articles.length || this.props.parentState.articleViewActive
    });
    const articleClasses = classNames({
      'u-isHidden': !this.props.parentState.articleViewActive
    });
    const formClasses = classNames({
      'u-isHidden': this.props.parentState.articleViewActive || this.props.parentState.hasSearched
    });
    const buttonContainerClasses = classNames({
      'u-marginVM': this.props.hideZendeskLogo,
      'u-isHidden': !this.props.parentState.hasSearched
    });

    const articleTemplate = function(article, index) {
      return (
        <li key={_.uniqueId('article_')} className='List-item'>
          <a className='u-userTextColor'
            href={article.html_url}
            target='_blank'
            onClick={this.props.handleArticleClick.bind(this, index)}>
              {article.title || article.name}
          </a>
        </li>
      );
    };

    const onFocusHandler = () => {
      this.props.updateParentState({ searchFieldFocused: true });
    };
    const onChangeValueHandler = (value) => {
      this.props.updateParentState({ searchFieldValue: value });
    };
    const hideZendeskLogo = this.props.hideZendeskLogo;

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(), 0);
    }

    const noResultsTemplate = () => {
      const noResultsClasses = classNames({
        'u-marginTM u-textCenter u-textSizeMed': true,
        'u-borderBottom List--noResults': true
      });
      const noResultsParagraphClasses = classNames({
        'u-textSecondary u-marginBL': true
      });
      /* eslint indent:0 */
      const title = (this.props.parentState.searchFailed)
                  ? i18n.t('embeddable_framework.helpCenter.search.error.title')
                  : i18n.t('embeddable_framework.helpCenter.search.noResults.title', {
                      searchTerm: this.props.parentState.previousSearchTerm
                    });
      const body = (this.props.parentState.searchFailed)
                 ? i18n.t('embeddable_framework.helpCenter.search.error.body')
                 : i18n.t('embeddable_framework.helpCenter.search.noResults.body');

      return (
        <div className={noResultsClasses} id='noResults'>
          <p className='u-marginBN u-marginTL'>
            {title}
          </p>
          <p className={noResultsParagraphClasses}>
            {body}
          </p>
        </div>
      );
    };

    const zendeskLogo = !hideZendeskLogo
                      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />
                      : null;

    const noResults = (!this.props.parentState.resultsCount && this.props.parentState.hasSearched)
                    ? noResultsTemplate()
                    : null;

    const resultsLegend = this.props.parentState.hasContextualSearched
                        ? i18n.t('embeddable_framework.helpCenter.label.topSuggestions')
                        : i18n.t('embeddable_framework.helpCenter.label.results');

   const hcform = (
      <form
        ref='helpCenterForm'
        className='Form u-cf'
        onChange={this.props.autoSearch}
        onSubmit={this.props.manualSearch}>

        <SearchField
          ref='searchField'
          fullscreen={false}
          onFocus={onFocusHandler}
          onChangeValue={onChangeValueHandler}
          hasSearched={this.props.parentState.hasSearched}
          onSearchIconClick={this.props.manualSearch}
          isLoading={this.props.parentState.isLoading} />
      </form>
   );

   const headerContent = (!this.props.parentState.articleViewActive && this.props.parentState.hasSearched)
                       ? hcform
                       : null;

   const footerContent = (
     <div className={buttonContainerClasses}>
       <ButtonGroup rtl={i18n.isRTL()}>
         <Button
           fullscreen={this.props.parentState.fullscreen}
           label={this.props.parentState.buttonLabel}
           onClick={this.props.handleNextClick} />
       </ButtonGroup>
     </div>
  );

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={hideZendeskLogo}
          title={i18n.t(`embeddable_framework.launcher.label.${this.props.formTitleKey}`)}
          headerContent={headerContent}
          footerContent={footerContent}>

          <div className={formClasses}>
            {hcform}
          </div>

          <h1 className={formLegendClasses}>
            <span className='Arrange-sizeFill'>
              {resultsLegend}
            </span>
          </h1>
          <ul className={listClasses}>
            {_.chain(this.props.parentState.articles).take(3).map(articleTemplate.bind(this)).value()}
          </ul>

          {noResults}

          <div className={articleClasses}>
            <HelpCenterArticle
              activeArticle={this.props.parentState.activeArticle}
              fullscreen={this.props.parentState.fullscreen} />
          </div>
        </ScrollContainer>

        {zendeskLogo}
      </div>
    );
  }
}

HelpCenterDesktop.propTypes = {
  parentState: PropTypes.object.isRequired,
  updateParentState: PropTypes.func.isRequired,
  handleArticleClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  autoSearch: PropTypes.func.isRequired,
  manualSearch: PropTypes.func.isRequired,
  buttonLabelKey: PropTypes.string,
  onSearch: PropTypes.func,
  showBackButton: PropTypes.func,
  onNextClick: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  updateFrameSize: PropTypes.any,
  style: PropTypes.object,
  formTitleKey: PropTypes.string
};

HelpCenterDesktop.defaultProps = {
  buttonLabelKey: 'message',
  onSearch: () => {},
  showBackButton: () => {},
  onNextClick: () => {},
  hideZendeskLogo: false,
  updateFrameSize: false,
  style: null,
  formTitleKey: 'help'
};
