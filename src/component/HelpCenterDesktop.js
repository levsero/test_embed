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
    this.refs.scrollContainer.setScrollShadowVisible(this.props.shadowVisible);
  }

  focusField() {
    if (!this.props.articleViewActive) {
      const searchField = this.refs.searchField;

      searchField.setValue(this.props.searchTerm);

      const searchFieldInputNode = searchField.getSearchField();
      const strLength = searchFieldInputNode.value.length;

      searchField.focus();
      if (searchFieldInputNode.setSelectionRange) {
        searchFieldInputNode.setSelectionRange(strLength, strLength);
      }
    }
  }

  renderForm(shouldHide) {
    const formClasses = classNames({
      'u-isHidden': shouldHide
    });

    return (
      <div className={formClasses}>
        <form
          ref='helpCenterForm'
          noValidate={true}
          className='Form u-cf'
          onChange={this.props.autoSearch}
          onSubmit={this.props.manualSearch}>

          <SearchField
            ref='searchField'
            fullscreen={false}
            onChangeValue={this.props.onChangeValueHandler}
            hasSearched={this.props.hasSearched}
            onSearchIconClick={this.props.manualSearch}
            isLoading={this.props.isLoading} />
        </form>
      </div>
    );
  }

  render() {
    const buttonContainerClasses = classNames({
      'u-marginVM': this.props.hideZendeskLogo,
      'u-isHidden': !this.props.hasSearched
    });
    const zendeskLogo = !this.props.hideZendeskLogo
                      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />
                      : null;
    const headerContent = (!this.props.articleViewActive && this.props.hasSearched)
                       ? this.renderForm(this.props.articleViewActive)
                       : null;

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
          headerContent={headerContent}
          footerContent={footerContent}>
          {this.renderForm(this.props.articleViewActive || this.props.hasSearched)}
          {this.props.children}
        </ScrollContainer>
        {zendeskLogo}
      </div>
    );
  }
}

HelpCenterDesktop.propTypes = {
  handleNextClick: PropTypes.func.isRequired,
  autoSearch: PropTypes.func.isRequired,
  manualSearch: PropTypes.func.isRequired,
  onChangeValueHandler: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  onNextClick: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  updateFrameSize: PropTypes.any,
  formTitleKey: PropTypes.string,
  isLoading: PropTypes.bool,
  articleViewActive: PropTypes.bool,
  hasSearched: PropTypes.bool,
  buttonLabel:PropTypes.string,
  shadowVisible: PropTypes.bool
};

HelpCenterDesktop.defaultProps = {
  onNextClick: () => {},
  hideZendeskLogo: false,
  updateFrameSize: false,
  formTitleKey: 'help',
  isLoading: false,
  articleViewActive: false,
  hasSearched: false,
  buttonLabel: 'Send a Message',
  shadowVisible: false
};
