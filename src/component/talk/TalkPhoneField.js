import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { SelectContainer, SelectView, Dropdown, Item, Label } from '@zendeskgarden/react-select';
import { FauxInput, Input } from '@zendeskgarden/react-textfields';
import { FieldContainer, composeEventHandlers, ControlledComponent } from '@zendeskgarden/react-selection';
import { ThemeProvider } from '@zendeskgarden/react-theming';
import styled from 'styled-components';

import { countriesByIso } from './talkCountries';
import { Flag } from 'component/Flag';
import { talkDropdownOverrides } from 'component/frame/gardenOverrides';

const StyledFauxInput = styled(FauxInput)`
  padding: 0 !important;
`;

const StyledInput = styled(Input)`
  padding: 10px !important;
  align-self: center !important;
`;

const ScrollableArea = styled.div`
  max-height: 215px;
  overflow: auto;
`;

const SmallFlag = styled(Flag)`
  height: 17.5px;
  margin-right: ${props => props.gap && '10px'}
`;

const FlexItem = styled(Item)`
  display: flex !important;
`;

export class TalkPhoneField extends ControlledComponent {
  static propTypes = {
    supportedCountries: PropTypes.array.isRequired,
    libphonenumber: PropTypes.object.isRequired,
    getFrameContentDocument: PropTypes.func.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    country: PropTypes.string,
    value: PropTypes.string,
    onCountrySelect: PropTypes.func
  };

  static defaultProps = {
    label: '',
    required: false,
    country: '',
    value: '',
    onCountrySelect: () => {}
  }

  constructor(props) {
    super(props);

    const selectedKey = props.country || props.supportedCountries[0];
    const inputValue = props.value
      ? this.formatPhoneNumber(selectedKey, props.value)
      : this.getCountryByIso(selectedKey).code;

    this.state = {
      selectedKey,
      inputValue,
      countries: this.formatCountries(props.supportedCountries),
      selectFocused: false,
      inputChangeTriggered: false
    };

    this.phoneInput = undefined;
  }

  onFlagChange = (selectedKey) => {
    if (selectedKey === this.state.selectedKey) return;

    const { code } = this.getCountryByIso(selectedKey);

    this.setState({ selectedKey, inputValue: code });

    // Input won't focus until nextTick
    setTimeout(() => this.phoneInput.focus(), 0);

    this.props.onCountrySelect(selectedKey, this.state.inputValue);
  }

  onFlagStateChange = ({ selectedKey }) => {
    // An item has been chosen turn of controlled focus of
    // fauxinput and pass it back to the component to control
    if (selectedKey) {
      this.setState({ selectFocused: false });
    }
  }

  formatCountries(supportedCountries) {
    return supportedCountries
      .map((iso) => this.getCountryByIso(iso))
      .sort((a, b) => {
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
      });
  }

  formatPhoneNumber(country, phoneNumber) {
    const { libphonenumber } = this.props;

    return new libphonenumber.AsYouType(country).input(phoneNumber);
  }

  getLabelProps = ({ onClick, ...other }) => {
    return {
      onClick: composeEventHandlers(onClick, () => {
        this.selectRef && this.selectRef.focus();
      }),
      ...other
    };
  };

  getInputProps = ({ selectRef, ...other }) => {
    return {
      selectRef: (ref) => {
        selectRef && selectRef(ref);
        this.selectRef = ref;
      },
      ...other
    };
  };

  onInputChange = (e) => {
    const { libphonenumber } = this.props;
    const { selectedKey } = this.state;
    const { value } = e.target;

    const { code } = this.getCountryByIso(selectedKey);
    const inputValue = !_.startsWith(value, code) ? code : this.formatPhoneNumber(selectedKey, value);

    if (libphonenumber.isValidNumber(inputValue, selectedKey)) {
      this.phoneInput.setCustomValidity('');
    } else {
      this.phoneInput.setCustomValidity('Error');
    }

    this.setState({ inputValue, inputChangeTriggered: true });
  }

  validate = () => {
    const { selectedKey, inputValue } = this.getControlledState();
    const { libphonenumber } = this.props;
    const { inputChangeTriggered } = this.state;

    if (inputChangeTriggered && !libphonenumber.isValidNumber(inputValue, selectedKey)) {
      return 'error';
    }
  }

  getCountryByIso(iso) {
    const { name, code } = countriesByIso[iso];

    return {
      name,
      iso,
      code: `+${code}`.replace('-', ' ')
    };
  }

  render() {
    // prop is applied this way as we only want to control it
    // when the select is focused. Otherwise omit and let the component
    // control its focus state
    const focused = this.state.selectFocused
      ? { focused: true }
      : {};

    return (
      <ThemeProvider
        document={this.props.getFrameContentDocument()}
        theme={talkDropdownOverrides}>
        <FieldContainer>
          {({getLabelProps: getFieldLabelProps, getInputProps: getFieldInputProps}) => {
            return (
              <div>
                <Label {...this.getLabelProps(getFieldLabelProps())}>{this.props.label}</Label>
                <StyledFauxInput
                  {...focused}
                  validation={this.validate()}
                  mediaLayout={true}
                  inputRef={container => this.containerRef = container}>
                  <SelectContainer
                    selectedKey={this.state.selectedKey}
                    onChange={this.onFlagChange}
                    onStateChange={this.onFlagStateChange}
                    appendToNode={this.props.getFrameContentDocument().body}
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
                        })}
                      >
                        <SmallFlag country={this.state.selectedKey} />
                      </SelectView>
                    )}
                  >
                    {({ getSelectProps, placement, getItemProps, focusedKey, selectedKey, dropdownRef }) => (
                      <Dropdown
                        {...getSelectProps({
                          placement,
                          animate: true,
                          dropdownRef,
                          style: { width: this.containerRef.getBoundingClientRect().width }
                        })}
                      >
                        <ScrollableArea>
                          {this.state.countries.map(({ name, iso, code }) => {
                            return (
                              <FlexItem
                                {...getItemProps({
                                  key: iso,
                                  textValue: name,
                                  focused: focusedKey === iso,
                                  checked: selectedKey === iso
                                })}
                              >
                                <SmallFlag gap={true} country={iso} />
                                {`${name} (${code})`}
                              </FlexItem>
                            );
                          })}
                        </ScrollableArea>
                      </Dropdown>
                    )}
                  </SelectContainer>
                  <StyledInput
                    {...getFieldInputProps()}
                    value={this.state.inputValue}
                    onChange={this.onInputChange}
                    type='tel'
                    name='phone'
                    autoComplete='off'
                    innerRef={node => this.phoneInput = node}
                    required={this.props.required}
                    bare={true} />
                </StyledFauxInput>
              </div>
            ); }}
        </FieldContainer>
      </ThemeProvider>
    );
  }
}
