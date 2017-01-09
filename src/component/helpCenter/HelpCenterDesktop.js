import React, { Component, PropTypes } from 'react';

import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { ChannelChoicePopup } from 'component/channelChoice/ChannelChoicePopup';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { SearchField } from 'component/field/SearchField';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';

import { locals as styles } from './HelpCenterDesktop.sass';

export class HelpCenterDesktop extends Component {
  static propTypes = {
    articleViewActive: PropTypes.bool,
    buttonLabel: PropTypes.string.isRequired,
    channelChoice: PropTypes.bool,
    children: PropTypes.node.isRequired,
    disableAutoComplete: PropTypes.bool,
    expanded: PropTypes.bool,
    formTitleKey: PropTypes.string,
    handleNextClick: PropTypes.func.isRequired,
    handleOnChangeValue: PropTypes.func.isRequired,
    hasSearched: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    isLoading: PropTypes.bool,
    onNextClick: PropTypes.func,
    search: PropTypes.func.isRequired,
    searchFieldValue: PropTypes.string,
    shadowVisible: PropTypes.bool,
    showNextButton: PropTypes.bool,
    updateFrameSize: PropTypes.func
  };

  static defaultProps = {
    articleViewActive: false,
    channelChoice: false,
    disableAutoComplete: false,
    expanded: false,
    formTitleKey: 'help',
    hasSearched: false,
    hideZendeskLogo: false,
    isLoading: false,
    onNextClick: () => {},
    searchFieldValue: '',
    shadowVisible: false,
    showNextButton: true,
    updateFrameSize: () => {}
  };

  constructor(props, context) {
    super(props, context);

    this.state = { channelChoiceShown: false };
  }

  componentDidUpdate = () => {
    if (this.refs.searchField) {
      this.refs.searchField.setState({
        searchInputVal: this.props.searchFieldValue
      });
    }

    const shadowVisible = this.props.shadowVisible &&
                          !(!this.props.showNextButton && this.props.hideZendeskLogo);

    this.refs.scrollContainer.setScrollShadowVisible(shadowVisible);
  }

  focusField = () => {
    if (!this.props.articleViewActive) {
      const searchField = this.refs.searchField;
      const searchFieldInputNode = searchField.getSearchField();
      const strLength = searchFieldInputNode.value.length;

      searchField.focus();

      if (searchFieldInputNode.setSelectionRange) {
        searchFieldInputNode.setSelectionRange(strLength, strLength);
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.search();
  }

  handleNextButtonClick = (e) => {
    e.preventDefault();

    if (this.props.channelChoice) {
      setTimeout(() => this.setState({ channelChoiceShown: true }), 0);
    } else {
      this.props.onNextClick();
    }
  }

  hideChannelChoice = () => {
    this.setState({ channelChoiceShown: false });
  }

  renderForm = () => {
    return (
      <form
        ref='helpCenterForm'
        noValidate={true}
        className={styles.form}
        onSubmit={this.handleSubmit}>

        <SearchField
          ref='searchField'
          fullscreen={false}
          disableAutoComplete={this.props.disableAutoComplete}
          onChangeValue={this.props.handleOnChangeValue}
          hasSearched={this.props.hasSearched}
          onSearchIconClick={this.handleSubmit}
          isLoading={this.props.isLoading} />
      </form>
    );
  }

  renderHeaderContent = () => {
    return (this.props.articleViewActive || !this.props.hasSearched)
         ? null
         : this.renderForm();
  }

  renderBodyForm = () => {
    return this.props.hasSearched
         ? null
         : this.renderForm();
  }

  renderZendeskLogo = () => {
    return !this.props.hideZendeskLogo
         ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />
         : null;
  }

  renderChannelChoice = () => {
    return this.state.channelChoiceShown
         ? <ChannelChoicePopup onNextClick={this.props.onNextClick} />
         : null;
  }

  renderFooterContent = () => {
    if (!this.props.showNextButton || !this.props.hasSearched) return null;

    return (
      <div className={styles.buttonContainer}>
        <ButtonGroup rtl={i18n.isRTL()}>
          <Button
            fullscreen={false}
            label={this.props.buttonLabel}
            onClick={this.handleNextButtonClick} />
        </ButtonGroup>
        {this.renderChannelChoice()}
      </div>
    );
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    let footerClasses = '';

    if (!this.props.showNextButton && this.props.hasSearched) {
      footerClasses = this.props.hideZendeskLogo ? styles.footer : styles.footerLogo;
    }

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={this.props.hideZendeskLogo}
          title={i18n.t(`embeddable_framework.helpCenter.form.title.${this.props.formTitleKey}`)}
          footerClasses={footerClasses}
          contentExpanded={this.props.expanded}
          headerContent={this.renderHeaderContent()}
          footerContent={this.renderFooterContent()}>
          {this.renderBodyForm()}
          {this.props.children}
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </div>
    );
  }
}
