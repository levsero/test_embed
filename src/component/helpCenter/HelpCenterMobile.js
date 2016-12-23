import React, { Component, PropTypes } from 'react';

import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { ScrollContainer } from 'component/ScrollContainer';
import { SearchField } from 'component/field/SearchField';
import { SearchFieldButton } from 'component/button/SearchFieldButton';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';

import { locals as styles } from './HelpCenterMobile.sass';

export class HelpCenterMobile extends Component {
  constructor = (props, context) => {
    super(props, context);
    this.state = {
      showIntroScreen: true,
      searchFieldFocused: false,
      hasContextualSearched: false
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
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

  resetState = () => {
    if (!this.props.hasSearched) {
      this.setState({
        showIntroScreen: true,
        searchFieldFocused: false
      });
    }
  }

  setContextualSearched = () => {
    this.setState({
      showIntroScreen: false,
      hasContextualSearched: true
    });
  }

  handleSearchBoxClicked = () => {
    this.setState({
      showIntroScreen: false,
      searchFieldFocused: true
    });
  }

  handleOnBlur = () => {
    // defer event to allow onClick events to fire first
    setTimeout(() => {
      this.setState({ searchFieldFocused: false });

      if (!this.props.hasSearched && !this.props.isLoading) {
        this.setState({ showIntroScreen: true });
      }
    }, 1);
  }

  handleOnFocus = () => {
    this.setState({ searchFieldFocused: true });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.search();
  }

  renderSearchField = () => {
    // needs to be hidden rather then return null so the
    // field can be focused on
    const searchFieldClasses = this.state.showIntroScreen ? 'u-isHidden' : '';

    return (
      <div className={searchFieldClasses}>
        <SearchField
          ref='searchField'
          fullscreen={true}
          onFocus={this.handleOnFocus}
          onBlur={this.handleOnBlur}
          onChangeValue={this.props.handleOnChangeValue}
          hasSearched={this.props.hasSearched}
          onSearchIconClick={this.handleSubmit}
          isLoading={this.props.isLoading} />
      </div>
    );
  }

  renderSearchFieldButton = () => {
    return !this.state.showIntroScreen
         ? null
         : <SearchFieldButton
             ref='searchFieldButton'
             onClick={this.handleSearchBoxClicked}
             onTouch={this.handleSearchBoxClicked}
             searchTerm={this.props.searchFieldValue} />;
  }

  renderForm = () => {
    const hiddenClasses = !this.state.showIntroScreen ? 'u-isHidden' : '';

    return (
      <form
        ref='helpCenterForm'
        className={styles.form}
        noValidate={true}
        onSubmit={this.handleSubmit}>
        <h1 className={`${styles.searchTitle} ${hiddenClasses}`}>
          {i18n.t('embeddable_framework.helpCenter.label.searchHelpCenter')}
        </h1>

        {this.renderSearchFieldButton()}
        {this.renderSearchField()}
      </form>
    );
  }

  renderFormContainer = () => {
    return this.props.articleViewActive || !this.state.showIntroScreen
         ? null
         : (<div>
             {this.renderForm()}
             {this.renderLinkContent()}
           </div>);
  }

  renderLinkContent = () => {
    if (!this.props.showNextButton || !this.state.showIntroScreen) return null;

    const linkContext = this.props.chatOnline
                      ? i18n.t('embeddable_framework.helpCenter.label.linkContext.chat')
                      : i18n.t('embeddable_framework.helpCenter.label.linkContext.submitTicket');

    return (
      <div className={styles.linkContainer}>
        <p className={styles.linkContext}>{linkContext}</p>
        <a className={styles.link} onClick={this.props.handleNextClick}>
          {this.props.buttonLabel}
        </a>
      </div>
    );
  }

  renderHeaderContent = () => {
    return (this.props.articleViewActive || this.state.showIntroScreen)
         ? null
         : this.renderForm();
  }

  renderFooterContent = () => {
    if (!this.props.showNextButton ||
       (this.state.showIntroScreen || this.state.searchFieldFocused)) return;

    const logoClasses = this.props.hideZendeskLogo ? styles.logoHidden : '';

    return (
      <div className={`${styles.buttonContainer} ${logoClasses}`}>
        <ButtonGroup rtl={i18n.isRTL()}>
          <Button
            fullscreen={true}
            label={this.props.buttonLabel}
            onClick={this.props.handleNextClick} />
        </ButtonGroup>
      </div>
    );
  }

  renderZendeskLogo = (hideZendeskLogo) => {
    return !hideZendeskLogo
         ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={true} />
         : null;
  }

  render = () => {
    const mobileHideLogoState = this.props.hasSearched;
    const hideZendeskLogo = this.props.hideZendeskLogo || mobileHideLogoState;

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={hideZendeskLogo}
          title={i18n.t(`embeddable_framework.helpCenter.form.title.${this.props.formTitleKey}`)}
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
  search: PropTypes.func.isRequired,
  handleOnChangeValue: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  hideZendeskLogo: PropTypes.bool,
  formTitleKey: PropTypes.string,
  buttonLabel: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  articleViewActive: PropTypes.bool,
  chatOnline: PropTypes.bool,
  hasSearched: PropTypes.bool,
  searchFieldValue: PropTypes.string,
  showNextButton: PropTypes.bool
};

HelpCenterMobile.defaultProps = {
  hideZendeskLogo: false,
  formTitleKey: 'help',
  isLoading: false,
  articleViewActive: false,
  chatOnline: false,
  hasSearched: false,
  searchFieldValue: '',
  showNextButton: true
};
