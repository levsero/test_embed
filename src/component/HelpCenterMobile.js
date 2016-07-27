import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Button,
         ButtonGroup } from 'component/Button';
import { SearchField } from 'component/field/SearchField';
import { SearchFieldButton } from 'component/button/SearchFieldButton';
import { ScrollContainer } from 'component/ScrollContainer';
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
      virtualKeyboardKiller: false
    };
  }

  focusField() {
    const searchField = this.refs.searchField;

    if (this.props.hasContextualSearched === false) {
      const searchField = this.refs.searchField;

      searchField.focus();
    }

    if (searchField) {
      searchField.setState({
        searchInputVal: this.props.searchFieldValue
      });
    }

    this.setState({
      searchFieldFocused: true
    });

    this.refs.scrollContainer.setScrollShadowVisible(this.props.articleViewActive);
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

    if (!this.props.hasSearched) {
      this.setState({
        showIntroScreen: true,
        searchFieldFocused: false
      });
    }
  }

  searchBoxClickHandler() {
    this.setState({
      showIntroScreen: false
    });

    setTimeout(() => {
      this.focusField();
    }, 0);
  }

  onBlurHandler() {
    // defer event to allow onClick events to fire first
    setTimeout(() => {
      this.setState({ searchFieldFocused: false });

      if (!this.props.hasSearched && !this.props.isLoading) {
        this.setState({
          showIntroScreen: true
        });
      }
    }, 1);
  }

  onFocusHandler() {
    this.setState({ searchFieldFocused: true });
  }

  renderSearchField() {
    const searchFieldClasses = classNames({
      'u-isHidden': this.state.showIntroScreen
    });

    return (
      <div className={searchFieldClasses}>
        <SearchField
          ref='searchField'
          fullscreen={true}
          onFocus={this.onFocusHandler}
          onBlur={this.onBlurHandler}
          onChangeValue={this.props.onChangeValueHandler}
          hasSearched={this.props.hasSearched}
          onSearchIconClick={this.manualSearch}
          isLoading={this.props.isLoading} />
      </div>
    );
  }

  renderSearchFieldButton() {
    const searchFieldButtonClasses = classNames({
      'u-isHidden': !this.state.showIntroScreen
    });

    return (
      <div className={searchFieldButtonClasses}>
        <SearchFieldButton
          ref='searchFieldButton'
          onClick={this.searchBoxClickHandler}
          onTouch={this.searchBoxClickHandler}
          searchTerm={this.props.searchFieldValue} />
      </div>
    );
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
        onSubmit={this.props.manualSearch}>
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
    const formClasses = classNames({
      'u-isHidden': this.props.articleViewActive || !this.state.showIntroScreen
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

    return (
      <div className={formClasses}>
        {this.renderForm()}
        <div className={linkClasses}>
          <p className='u-marginBN'>{linkContext}</p>
          <a className='u-userTextColor' onClick={this.props.handleNextClick}>
            {linkLabel}
          </a>
        </div>
      </div>
    );
  }

  render() {
    const buttonContainerClasses = classNames({
      'u-marginTA': true,
      'u-marginVM': this.props.hideZendeskLogo,
      'u-isHidden': this.state.showIntroScreen || this.state.searchFieldFocused
    });
    const mobileHideLogoState = this.props.hasSearched;
    const hideZendeskLogo = this.props.hideZendeskLogo || mobileHideLogoState;
    const zendeskLogo = !hideZendeskLogo
                      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={true} />
                      : null;
    const headerContent = (!this.props.articleViewActive && !this.state.showIntroScreen)
                        ? this.renderForm()
                        : null;

    const footerContent = (
      <div className={buttonContainerClasses}>
        <ButtonGroup rtl={i18n.isRTL()}>
          <Button
            fullscreen={true}
            label={this.props.buttonLabel}
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
          {this.renderFormContainer()}
          {this.props.children}
        </ScrollContainer>
        {zendeskLogo}
      </div>
    );
  }
}

HelpCenterMobile.propTypes = {
  handleNextClick: PropTypes.func.isRequired,
  autoSearch: PropTypes.func.isRequired,
  manualSearch: PropTypes.func.isRequired,
  onChangeValueHandler: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  buttonLabelKey: PropTypes.string,
  hideZendeskLogo: PropTypes.bool,
  formTitleKey: PropTypes.string,
  isLoading: PropTypes.bool,
  articleViewActive: PropTypes.bool,
  hasSearched: PropTypes.bool,
  buttonLabel: PropTypes.string,
  hasContextualSearched: PropTypes.bool,
  searchFieldValue: PropTypes.string
};

HelpCenterMobile.defaultProps = {
  buttonLabelKey: 'message',
  hideZendeskLogo: false,
  formTitleKey: 'help',
  isLoading: false,
  articleViewActive: false,
  hasSearched: false,
  buttonLabel: 'Leave a Message',
  hasContextualSearched: false,
  searchFieldValue: ''
};
