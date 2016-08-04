import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { ScrollContainer } from 'component/ScrollContainer';
import { SearchField } from 'component/field/SearchField';
import { SearchFieldButton } from 'component/button/SearchFieldButton';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';

export class HelpCenterMobile extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, HelpCenterMobile.prototype);

    this.state = {
      showIntroScreen: true,
      searchFieldFocused: false,
      hasContextualSearched: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchField } = this.refs;

    // We have to do this check in componentDidUpdate so that
    // the searchField is the most recent one and ios focuses
    // on the correct one.
    if (prevState.showIntroScreen === true &&
        this.state.showIntroScreen === false &&
        this.state.hasContextualSearched === false) {
      searchField.focus();
    }

    if (searchField) {
      searchField.setState({
        searchInputVal: this.props.searchFieldValue
      });
    }
  }

  resetState() {
    if (!this.props.hasSearched) {
      this.setState({
        showIntroScreen: true,
        searchFieldFocused: false
      });
    }
  }

  setContextualSearched() {
    this.setState({
      showIntroScreen: false,
      hasContextualSearched: true
    });
  }

  handleSearchBoxClicked() {
    this.setState({
      showIntroScreen: false,
      searchFieldFocused: true
    });
  }

  handleOnBlur() {
    // defer event to allow onClick events to fire first
    setTimeout(() => {
      this.setState({ searchFieldFocused: false });

      if (!this.props.hasSearched && !this.props.isLoading) {
        this.setState({ showIntroScreen: true });
      }
    }, 1);
  }

  handleOnFocus() {
    this.setState({ searchFieldFocused: true });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.manualSearch();
  }

  renderSearchField() {
    // needs to be hidden rather then return null so the
    // field can be focused on
    const searchFieldClasses = classNames({
      'u-isHidden': this.state.showIntroScreen
    });

    return (
      <div className={searchFieldClasses}>
        <SearchField
          ref='searchField'
          fullscreen={true}
          onFocus={this.handleOnFocus}
          onBlur={this.handleOnBlur}
          disableAutoSearch={this.props.disableAutoSearch}
          onChangeValue={this.props.handleOnChangeValue}
          hasSearched={this.props.hasSearched}
          onSearchIconClick={this.handleSubmit}
          isLoading={this.props.isLoading} />
      </div>
    );
  }

  renderSearchFieldButton() {
    return !this.state.showIntroScreen
         ? null
         : <SearchFieldButton
             ref='searchFieldButton'
             onClick={this.handleSearchBoxClicked}
             onTouch={this.handleSearchBoxClicked}
             searchTerm={this.props.searchFieldValue} />;
  }

  renderForm() {
    const searchTitleClasses = classNames({
      'u-textSizeBaseMobile u-marginTM u-textCenter': true,
      'Container--fullscreen-center-vert': true,
      'u-isHidden': !this.state.showIntroScreen
    });

    return (
      <form
        ref='helpCenterForm'
        className='Form u-cf'
        noValidate={true}
        onSubmit={this.handleSubmit}>
        <h1 className={searchTitleClasses}>
          {i18n.t('embeddable_framework.helpCenter.label.searchHelpCenter')}
        </h1>

        {this.renderSearchFieldButton()}
        {this.renderSearchField()}
      </form>
    );
  }

  renderFormContainer() {
    const linkClasses = classNames({
      'u-textSizeBaseMobile u-textCenter u-marginTL': true,
      'u-isHidden': !this.state.showIntroScreen
    });
    const chatButtonLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.chat');

    let linkLabel, linkContext;

    if (this.props.buttonLabel === chatButtonLabel) {
      linkContext = i18n.t('embeddable_framework.helpCenter.label.linkContext.chat');
      linkLabel = i18n.t('embeddable_framework.helpCenter.label.link.chat');
    } else {
      linkContext = i18n.t('embeddable_framework.helpCenter.label.linkContext.submitTicket');
      linkLabel = i18n.t(
        `embeddable_framework.helpCenter.submitButton.label.submitTicket.${
          this.props.buttonLabelKey
        }`
      );
    }

    return this.props.articleViewActive || !this.state.showIntroScreen
         ? null
         : (<div>
             {this.renderForm()}
             <div className={linkClasses}>
               <p className='u-marginBN'>{linkContext}</p>
               <a className='u-userTextColor' onClick={this.props.handleNextClick}>
                 {linkLabel}
               </a>
             </div>
           </div>);
  }

  renderHeaderContent() {
    return (this.props.articleViewActive || this.state.showIntroScreen)
         ? null
         : this.renderForm();
  }

  renderFooterContent() {
    const buttonContainerClasses = classNames({
      'u-marginTA': true,
      'u-marginVM': this.props.hideZendeskLogo,
      'u-isHidden': this.state.showIntroScreen || this.state.searchFieldFocused
    });

    return (
      <div className={buttonContainerClasses}>
        <ButtonGroup rtl={i18n.isRTL()}>
          <Button
            fullscreen={true}
            label={this.props.buttonLabel}
            onClick={this.props.handleNextClick} />
        </ButtonGroup>
      </div>
    );
  }

  renderZendeskLogo(hideZendeskLogo) {
    return !hideZendeskLogo
         ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={true} />
         : null;
  }

  render() {
    const mobileHideLogoState = this.props.hasSearched;
    const hideZendeskLogo = this.props.hideZendeskLogo || mobileHideLogoState;

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={hideZendeskLogo}
          title={i18n.t(`embeddable_framework.launcher.label.${this.props.formTitleKey}`)}
          headerContent={this.renderHeaderContent()}
          footerContent={this.renderFooterContent()}
          fullscreen={true}
          isVirtualKeyboardOpen={this.state.searchFieldFocused}>
          {this.renderFormContainer()}
          {this.props.children}
        </ScrollContainer>
        {this.renderZendeskLogo(hideZendeskLogo)}
      </div>
    );
  }
}

HelpCenterMobile.propTypes = {
  handleNextClick: PropTypes.func.isRequired,
  manualSearch: PropTypes.func.isRequired,
  handleOnChangeValue: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  buttonLabelKey: PropTypes.string,
  hideZendeskLogo: PropTypes.bool,
  formTitleKey: PropTypes.string,
  isLoading: PropTypes.bool,
  articleViewActive: PropTypes.bool,
  hasSearched: PropTypes.bool,
  buttonLabel: PropTypes.string,
  searchFieldValue: PropTypes.string,
  disableAutoSearch: PropTypes.bool
};

HelpCenterMobile.defaultProps = {
  buttonLabelKey: 'message',
  hideZendeskLogo: false,
  formTitleKey: 'help',
  isLoading: false,
  articleViewActive: false,
  hasSearched: false,
  buttonLabel: 'Leave a Message',
  searchFieldValue: '',
  disableAutoSearch: false
};
