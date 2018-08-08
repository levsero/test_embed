import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SelectContainer, SelectView, Dropdown, Item } from '@zendeskgarden/react-select';
import styled from 'styled-components';

import { FONT_SIZE } from 'constants/shared';
import { Flag } from 'component/Flag';

const ScrollableArea = styled.div`
  max-height: ${215/FONT_SIZE}rem;
  overflow: auto;
`;

const SmallFlag = styled(Flag)`
  height: ${17.5/FONT_SIZE}rem;
  [dir='ltr'] & {
    margin-right: ${props => props.gap && `${10/FONT_SIZE}rem`}
  }

  [dir='rtl'] & {
    margin-left: ${props => props.gap && `${10/FONT_SIZE}rem`}
  }
`;

const FlexItem = styled(Item)`
  display: flex !important;
`;

export class TalkCountryDropdown extends Component {
  static propTypes = {
    document: PropTypes.object.isRequired,
    getContainerRef: PropTypes.func.isRequired,
    selectedKey: PropTypes.string,
    countries: PropTypes.array,
    onChange: PropTypes.func
  };

  static defaultProps = {
    selectedKey: '',
    countries: [],
    style: {},
    onChange: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      selectFocused: false
    };
  }

  handleStateChange = ({ selectedKey }) => {
    // An item has been chosen turn of controlled focus of
    // fauxinput and pass it back to the component to control
    if (selectedKey) {
      this.setState({ selectFocused: false });
    }
  }

  selectFocused() {
    return this.state.selectFocused;
  }

  renderDropdown = ({ getSelectProps, getItemProps, placement, focusedKey, selectedKey, dropdownRef }) => {
    const { countries, getContainerRef } = this.props;
    const style = { width: getContainerRef().getBoundingClientRect().width };

    return (
      <Dropdown
        {...getSelectProps({ placement, animate: true, dropdownRef, style })}>
        <ScrollableArea>
          {countries.map(({ name, iso, code }) => {
            const itemProps = getItemProps({
              key: iso,
              textValue: name,
              focused: focusedKey === iso,
              checked: selectedKey === iso
            });

            return (
              <FlexItem {...itemProps}>
                <SmallFlag gap={true} country={iso} />
                {`${name} (${code})`}
              </FlexItem>
            );
          })}
        </ScrollableArea>
      </Dropdown>
    );
  }

  render() {
    const { document, selectedKey, onChange } = this.props;

    return (
      <SelectContainer
        selectedKey={selectedKey}
        onChange={onChange}
        onStateChange={this.handleStateChange}
        appendToNode={document.body}
        trigger={({ getTriggerProps, triggerRef, isOpen }) => (
          <SelectView
            {...getTriggerProps({
              open: isOpen,
              onClick: () => {
                // This fires before state update so if open is false it means
                // it's about to be opened
                this.setState({ selectFocused: !isOpen });
              },
              inputRef: ref => {
                this.triggerRef = ref;
                triggerRef(ref);
              }
            })}>
            <SmallFlag country={selectedKey} />
          </SelectView>
        )}>
        {this.renderDropdown}
      </SelectContainer>
    );
  }
}
