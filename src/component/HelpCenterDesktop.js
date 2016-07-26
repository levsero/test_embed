import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import { SearchField } from 'component/field/SearchField';
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
      const searchField = this.refs.searchField;
      const searchFieldInputNode = searchField.getSearchField();
      const strLength = searchFieldInputNode.value.length;

      searchField.focus();
      if (searchFieldInputNode.setSelectionRange) {
        searchFieldInputNode.setSelectionRange(strLength, strLength);
      }
    }
  }

  render() {
    const formClasses = classNames({
      'u-isHidden': this.props.parentState.articleViewActive || this.props.parentState.hasSearched
    });
    const buttonContainerClasses = classNames({
      'u-marginVM': this.props.hideZendeskLogo,
      'u-isHidden': !this.props.parentState.hasSearched
    });

    const hideZendeskLogo = this.props.hideZendeskLogo;

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(), 0);
    }

    const zendeskLogo = !hideZendeskLogo
                      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />
                      : null;

   const hcform = (
      <form
        ref='helpCenterForm'
        className='Form u-cf'
        onChange={this.props.autoSearch}
        onSubmit={this.props.manualSearch}>

        <SearchField
          ref='searchField'
          fullscreen={false}
          onChangeValue={this.props.onChangeValueHandler}
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

          {this.props.children}
        </ScrollContainer>

        {zendeskLogo}
      </div>
    );
  }
}

HelpCenterDesktop.propTypes = {
  parentState: PropTypes.object.isRequired,
  handleArticleClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  autoSearch: PropTypes.func.isRequired,
  manualSearch: PropTypes.func.isRequired,
  onSearch: PropTypes.func,
  showBackButton: PropTypes.func,
  onNextClick: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  updateFrameSize: PropTypes.any,
  style: PropTypes.object,
  formTitleKey: PropTypes.string
};

HelpCenterDesktop.defaultProps = {
  onSearch: () => {},
  showBackButton: () => {},
  onNextClick: () => {},
  hideZendeskLogo: false,
  updateFrameSize: false,
  style: null,
  formTitleKey: 'help'
};
