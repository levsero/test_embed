import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { SearchField } from 'component/field/SearchField';
import { SearchFieldButton } from 'component/button/SearchFieldButton';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { ScrollContainer } from 'component/ScrollContainer';
import { i18n } from 'service/i18n';
import { Button,
         ButtonGroup } from 'component/Button';
import { bindMethods } from 'utility/utils';

export class HelpCenterMobile extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, HelpCenterMobile.prototype);

    this.state = {
      showIntroScreen: true,
      searchFieldFocused: false,
      virtualKeyboardKiller: false
    };
  }

  focusField() {
    const searchField = this.refs.searchField;

    if (this.props.parentState.hasContextualSearched === false) {
        const searchField = this.refs.searchField;

        searchField.focus();
    }

    if (searchField) {
      searchField.setState({
        searchInputVal: this.props.parentState.searchFieldValue
      });
    }

    this.refs.scrollContainer.setScrollShadowVisible(this.props.parentState.articleViewActive);
  }

  resetSearchFieldState() {
    // if the user closes and reopens, we need to
    // re-render the search field
    this.setState({
      virtualKeyboardKiller: false
    });
  }

  hideVirtualKeyboard() {
    // in order for the virtual keyboard to hide in iOS 7,
    // we need to remove the element from the DOM. It has been fixed
    // in iOS 8.
    this.setState({
      virtualKeyboardKiller: true
    });
  }

  searchBoxClickHandler() {
    this.setState({
      showIntroScreen: false
    });

    setTimeout(() => {
      this.focusField();
    }, 0)
  }

  onBlurHandler() {
    // defer event to allow onClick events to fire first
    setTimeout(() => {
      this.setState({ searchFieldFocused: false });

      if (!this.props.parentState.hasSearched && !this.props.parentState.isLoading) {
        this.setState({
          showIntroScreen: true
        });
      }
    }, 1);
  }

  onFocusHandler() {
    this.setState({ searchFieldFocused: true });
  }

  render() {
    const searchTitleClasses = classNames({
      'u-textSizeBaseMobile u-marginTM u-textCenter': true,
      'Container--fullscreen-center-vert': true,
      'u-isHidden': !this.state.showIntroScreen
    });
    const linkClasses = classNames({
      'u-textSizeBaseMobile u-textCenter u-marginTL': true,
      'u-isHidden': !this.state.showIntroScreen
    });
    const formClasses = classNames({
      'u-isHidden': this.props.parentState.articleViewActive || !this.state.showIntroScreen
    });
    const buttonContainerClasses = classNames({
      'u-marginTA': true,
      'u-marginVM': this.props.hideZendeskLogo,
      'u-isHidden': this.state.showIntroScreen || this.state.searchFieldFocused
    });
    const searchFieldClasses = classNames({
      'u-isHidden': this.state.showIntroScreen
    });
    const searchFieldButtonClasses = classNames({
      'u-isHidden': !this.state.showIntroScreen
    })

    const chatButtonLabel = i18n.t('embeddable_framework.helpCenter.submitButton.label.chat');
    const mobileHideLogoState = this.props.parentState.hasSearched;
    const hideZendeskLogo = this.props.hideZendeskLogo || mobileHideLogoState;

    let linkLabel, linkContext;

    if (this.props.parentState.buttonLabel === chatButtonLabel) {
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

    const zendeskLogo = !hideZendeskLogo
                      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={true} />
                      : null;

    const searchField = (
      <div className={searchFieldClasses}>
        <SearchField
          ref='searchField'
          fullscreen={true}
          onFocus={this.onFocusHandler}
          onBlur={this.onBlurHandler}
          onChangeValue={this.props.onChangeValueHandler}
          hasSearched={this.props.parentState.hasSearched}
          onSearchIconClick={this.manualSearch}
          isLoading={this.props.parentState.isLoading} />
      </div>
    );

    const searchFieldButton = (
      <div className={searchFieldButtonClasses}>
        <SearchFieldButton
          ref='searchFieldButton'
          onClick={this.searchBoxClickHandler}
          onTouch={this.searchBoxClickHandler}
          searchTerm={this.props.parentState.searchFieldValue} />
      </div>
    );

    const hcform = (
      <form
        ref='helpCenterForm'
        className='Form u-cf'
        onSubmit={this.props.manualSearch}>
        <h1 className={searchTitleClasses}>
          {i18n.t('embeddable_framework.helpCenter.label.searchHelpCenter')}
        </h1>

        {searchFieldButton}
        {searchField}
      </form>
    );

   const headerContent = (!this.props.parentState.articleViewActive && !this.state.showIntroScreen)
                       ? hcform
                       : null;

   const footerContent = (
      <div className={buttonContainerClasses}>
        <ButtonGroup rtl={i18n.isRTL()}>
          <Button
            fullscreen={true}
            label={this.props.parentState.buttonLabel}
            onClick={this.props.handleNextClick} />
        </ButtonGroup>
      </div>);

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={hideZendeskLogo}
          title={i18n.t(`embeddable_framework.launcher.label.${this.props.formTitleKey}`)}
          headerContent={headerContent}
          footerContent={footerContent}
          fullscreen={true}
          isVirtualKeyboardOpen={this.state.searchFieldFocused}>

          <div className={formClasses}>
            {hcform}
            <div className={linkClasses}>
              <p className='u-marginBN'>{linkContext}</p>
              <a className='u-userTextColor' onClick={this.props.handleNextClick}>
                {linkLabel}
              </a>
            </div>
          </div>

          {this.props.children}
        </ScrollContainer>

        {zendeskLogo}
      </div>
    );
  }
}

HelpCenterMobile.propTypes = {
  parentState: PropTypes.object.isRequired,
  handleArticleClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  autoSearch: PropTypes.func.isRequired,
  manualSearch: PropTypes.func.isRequired,
  buttonLabelKey: PropTypes.string,
  onSearch: PropTypes.func,
  showBackButton: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  style: PropTypes.object,
  formTitleKey: PropTypes.string
};

HelpCenterMobile.defaultProps = {
  buttonLabelKey: 'message',
  onSearch: () => {},
  showBackButton: () => {},
  hideZendeskLogo: false,
  style: null,
  formTitleKey: 'help'
};
