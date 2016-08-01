import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Button,
         ButtonGroup } from 'component/Button';
import { ScrollContainer } from 'component/ScrollContainer';
import { SearchField } from 'component/field/SearchField';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import { bindMethods } from 'utility/utils';

export class HelpCenterDesktop extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, HelpCenterDesktop.prototype);
  }

  componentDidUpdate() {
    if (this.refs.searchField) {
      this.refs.searchField.setState({
        searchInputVal: this.props.searchFieldValue
      });
    }

    this.refs.scrollContainer.setScrollShadowVisible(this.props.shadowVisible);
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

  render() {
    const buttonContainerClasses = classNames({
      'u-marginVM': this.props.hideZendeskLogo,
      'u-isHidden': !this.props.hasSearched
    });

    setTimeout(() => this.props.updateFrameSize(), 0);

    const footerContent = (
      <div className={buttonContainerClasses}>
        <ButtonGroup rtl={i18n.isRTL()}>
          <Button
            fullscreen={false}
            label={this.props.buttonLabel}
            onClick={this.props.handleNextClick} />
        </ButtonGroup>
      </div>
    );

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={this.props.hideZendeskLogo}
          title={i18n.t(`embeddable_framework.launcher.label.${this.props.formTitleKey}`)}
          headerContent={this.renderHeaderContent()}
          footerContent={footerContent}>
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
  updateFrameSize: PropTypes.any,
  formTitleKey: PropTypes.string,
  isLoading: PropTypes.bool,
  articleViewActive: PropTypes.bool,
  hasSearched: PropTypes.bool,
  buttonLabel:PropTypes.string,
  shadowVisible: PropTypes.bool,
  searchFieldValue: PropTypes.string
};

HelpCenterDesktop.defaultProps = {
  onNextClick: () => {},
  hideZendeskLogo: false,
  updateFrameSize: () => {},
  formTitleKey: 'help',
  isLoading: false,
  articleViewActive: false,
  hasSearched: false,
  buttonLabel: 'Send a Message',
  shadowVisible: false,
  searchFieldValue: ''
};
