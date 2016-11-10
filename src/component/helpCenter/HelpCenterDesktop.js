import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { ChannelChoicePopup } from 'component/channelChoice/ChannelChoicePopup';
import { ScrollContainer } from 'component/ScrollContainer';
import { SearchField } from 'component/field/SearchField';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';

export class HelpCenterDesktop extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, HelpCenterDesktop.prototype);

    this.state = { channelChoiceShown: false };
  }

  componentDidUpdate() {
    if (this.refs.searchField) {
      this.refs.searchField.setState({
        searchInputVal: this.props.searchFieldValue
      });
    }

    const shadowVisible = this.props.shadowVisible &&
                          !(!this.props.showNextButton && this.props.hideZendeskLogo);

    this.refs.scrollContainer.setScrollShadowVisible(shadowVisible);
  }

  focusField() {
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

  handleSubmit(e) {
    e.preventDefault();
    this.props.manualSearch();
  }

  handleChange(e) {
    e.preventDefault();
    this.props.autoSearch();
  }

  handleNextButtonClick(e) {
    e.preventDefault();

    if (this.props.channelChoice) {
      setTimeout(() => this.setState({ channelChoiceShown: true }), 0);
    } else {
      this.props.onNextClick();
    }
  }

  hideChannelChoice() {
    this.setState({ channelChoiceShown: false });
  }

  renderForm() {
    return (
      <form
        ref='helpCenterForm'
        noValidate={true}
        className='Form u-cf'
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}>

        <SearchField
          ref='searchField'
          fullscreen={false}
          disableAutoSearch={this.props.disableAutoSearch}
          onChangeValue={this.props.handleOnChangeValue}
          hasSearched={this.props.hasSearched}
          onSearchIconClick={this.handleSubmit}
          isLoading={this.props.isLoading} />
      </form>
    );
  }

  renderHeaderContent() {
    return (this.props.articleViewActive || !this.props.hasSearched)
         ? null
         : this.renderForm();
  }

  renderBodyForm() {
    return this.props.hasSearched
         ? null
         : this.renderForm();
  }

  renderZendeskLogo() {
    return !this.props.hideZendeskLogo
         ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />
         : null;
  }

  renderFooterContent() {
    if (!this.props.showNextButton) return null;

    const buttonContainerClasses = classNames({
      'u-posRelative': true,
      'u-marginVM': this.props.hideZendeskLogo,
      'u-isHidden': !this.props.hasSearched
    });
    const channelChoiceClasses = classNames({
      'u-isHidden': !this.state.channelChoiceShown
    });
    const buttonLabel = this.props.channelChoice
                      ? i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket.contact')
                      : this.props.buttonLabel;

    return (
      <div className={buttonContainerClasses}>
        <ButtonGroup rtl={i18n.isRTL()}>
          <Button
            fullscreen={false}
            label={buttonLabel}
            onClick={this.handleNextButtonClick} />
        </ButtonGroup>
        <div className={channelChoiceClasses}>
          <ChannelChoicePopup
            onNextClick={this.props.onNextClick} />
        </div>
      </div>
    );
  }

  render() {
    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={this.props.hideZendeskLogo}
          title={i18n.t(`embeddable_framework.helpCenter.form.title.${this.props.formTitleKey}`)}
          footerContentHidden={!this.props.showNextButton && this.props.hasSearched}
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
  autoSearch: PropTypes.func.isRequired,
  manualSearch: PropTypes.func.isRequired,
  handleOnChangeValue: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  onNextClick: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  updateFrameSize: PropTypes.func,
  formTitleKey: PropTypes.string,
  isLoading: PropTypes.bool,
  articleViewActive: PropTypes.bool,
  hasSearched: PropTypes.bool,
  buttonLabel:PropTypes.string,
  shadowVisible: PropTypes.bool,
  searchFieldValue: PropTypes.string,
  disableAutoSearch: PropTypes.bool,
  channelChoice: PropTypes.bool,
  showNextButton: PropTypes.bool
};

HelpCenterDesktop.defaultProps = {
  onNextClick: () => {},
  hideZendeskLogo: false,
  updateFrameSize: () => {},
  formTitleKey: 'help',
  isLoading: false,
  articleViewActive: false,
  hasSearched: false,
  buttonLabel: 'message',
  shadowVisible: false,
  searchFieldValue: '',
  disableAutoSearch: false,
  channelChoice: false,
  showNextButton: true
};
