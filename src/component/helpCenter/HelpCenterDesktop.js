import React, { Component, PropTypes } from 'react';

import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { ChannelChoicePopup } from 'component/channelChoice/ChannelChoicePopup';
import { ScrollContainer } from 'component/ScrollContainer';
import { SearchField } from 'component/field/SearchField';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';

import { locals as styles } from './HelpCenterDesktop.sass';

export class HelpCenterDesktop extends Component {
  constructor = (props, context) => {
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

    const logoClasses = this.props.hideZendeskLogo ? styles.logoHidden : '';

    return (
      <div className={`${styles.buttonContainer} ${logoClasses}`}>
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

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={this.props.hideZendeskLogo}
          title={i18n.t(`embeddable_framework.helpCenter.form.title.${this.props.formTitleKey}`)}
          footerContentHidden={!this.props.showNextButton && this.props.hasSearched}
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

HelpCenterDesktop.propTypes = {
  handleNextClick: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  handleOnChangeValue: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  onNextClick: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  updateFrameSize: PropTypes.func,
  formTitleKey: PropTypes.string,
  isLoading: PropTypes.bool,
  articleViewActive: PropTypes.bool,
  hasSearched: PropTypes.bool,
  buttonLabel: PropTypes.string.isRequired,
  shadowVisible: PropTypes.bool,
  searchFieldValue: PropTypes.string,
  channelChoice: PropTypes.bool,
  showNextButton: PropTypes.bool,
  expanded: PropTypes.bool
};

HelpCenterDesktop.defaultProps = {
  onNextClick: () => {},
  hideZendeskLogo: false,
  updateFrameSize: () => {},
  formTitleKey: 'help',
  isLoading: false,
  articleViewActive: false,
  hasSearched: false,
  shadowVisible: false,
  searchFieldValue: '',
  channelChoice: false,
  showNextButton: true,
  expanded: false
};
