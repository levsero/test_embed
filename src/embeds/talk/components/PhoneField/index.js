import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Label } from '@zendeskgarden/react-select'
import { Message, FauxInput, Input } from '@zendeskgarden/react-textfields'
import {
  FieldContainer,
  composeEventHandlers,
  ControlledComponent
} from '@zendeskgarden/react-selection'
import { ThemeProvider } from '@zendeskgarden/react-theming'
import styled from 'styled-components'
import { FONT_SIZE } from 'constants/shared'
import { i18n } from 'service/i18n'
import countriesByIso from 'translation/ze_countries'
import CountryDropdown from 'src/embeds/talk/components/CountryDropdown'
import styleOverrides from './styles.overrides'
import { getLibPhoneNumberVendor } from 'src/redux/modules/talk/talk-selectors'
import { getStyledLabelText } from 'utility/fields'

const StyledFauxInput = styled(FauxInput)`
  padding: 0 !important;
`

const StyledInput = styled(Input)`
  padding: ${10 / FONT_SIZE}rem !important;
  align-self: center !important;
`

const StyledContainer = styled.div`
  margin-bottom: ${16 / FONT_SIZE}rem !important;
`

const mapStateToProps = state => {
  return {
    libphonenumber: getLibPhoneNumberVendor(state),
    isRTL: i18n.isRTL(),
    label: getStyledLabelText(i18n.t('embeddable_framework.common.textLabel.phone_number'), true),
    errorMessage: i18n.t('embeddable_framework.validation.error.phone')
  }
}

class PhoneField extends ControlledComponent {
  static propTypes = {
    supportedCountries: PropTypes.arrayOf(PropTypes.string).isRequired,
    libphonenumber: PropTypes.shape({
      AsYouType: PropTypes.func,
      isValidNumber: PropTypes.func
    }).isRequired,
    getFrameContentDocument: PropTypes.func.isRequired,
    rtl: PropTypes.bool,
    label: PropTypes.string,
    required: PropTypes.bool,
    country: PropTypes.string,
    value: PropTypes.string,
    onCountrySelect: PropTypes.func,
    showError: PropTypes.bool
  }

  static defaultProps = {
    required: false,
    country: '',
    value: '',
    onCountrySelect: () => {},
    showError: false
  }

  constructor(props) {
    super(props)

    const selectedKey = props.country || props.supportedCountries[0]
    const inputValue = props.value
      ? this.formatPhoneNumber(selectedKey, props.value)
      : this.getCountryByIso(selectedKey).code

    this.state = {
      selectedKey,
      inputValue,
      countries: this.formatCountries(props.supportedCountries),
      valid: false,
      countryDropdownOpen: false
    }

    this.phoneInput = undefined
  }

  onFlagChange = selectedKey => {
    if (selectedKey === this.state.selectedKey) return

    const { code } = this.getCountryByIso(selectedKey)

    this.setState({ selectedKey, inputValue: code })

    // Input won't focus until nextTick
    setTimeout(() => this.phoneInput.focus(), 0)

    this.props.onCountrySelect(selectedKey)
  }

  formatCountries(supportedCountries) {
    return supportedCountries
      .map(iso => this.getCountryByIso(iso))
      .sort((a, b) => {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      })
  }

  formatPhoneNumber(country, phoneNumber) {
    const { libphonenumber } = this.props

    return new libphonenumber.AsYouType(country).input(phoneNumber)
  }

  getLabelProps = ({ onClick, ...other }) => {
    return {
      onClick: composeEventHandlers(onClick, () => {
        this.selectRef && this.selectRef.focus()
      }),
      ...other
    }
  }

  isValid = (phoneValue, selectedKey) => {
    const { libphonenumber } = this.props

    if (libphonenumber.isValidNumber(phoneValue, selectedKey)) {
      this.phoneInput.setCustomValidity('')
      this.setState({ valid: true })
    } else {
      this.setState({ valid: false })
      this.phoneInput.setCustomValidity('Error')
    }
  }

  getPhoneValue = (inputValue, selectedKey) => {
    const { code } = this.getCountryByIso(selectedKey)

    return !_.startsWith(inputValue, code) ? code : this.formatPhoneNumber(selectedKey, inputValue)
  }

  onInputChange = e => {
    const phoneValue = this.getPhoneValue(e.target.value, this.state.selectedKey)

    this.isValid(phoneValue, this.state.selectedKey)
    this.setState({ inputValue: phoneValue })
  }

  getCountryByIso(iso) {
    const { name, code } = countriesByIso[iso]

    return {
      name,
      iso,
      // We format the number as the user types which removes any dashes from the input.
      // When storing the dialing code we need to replace the dash with a space so we can match it.
      code: `+${code}`.replace('-', ' ')
    }
  }

  componentDidMount = () => {
    this.isValid(this.state.inputValue, this.state.selectedKey)
  }

  render() {
    // prop is applied this way as we only want to control it
    // when the select is focused. Otherwise omit and let the component
    // control its focus state
    const focused = this.state.countryDropdownOpen ? { focused: true } : {}
    const showError = this.props.showError && !this.state.valid

    return (
      <StyledContainer>
        <ThemeProvider
          rtl={this.props.rtl}
          document={this.props.getFrameContentDocument()}
          theme={styleOverrides}
        >
          <FieldContainer>
            {({ getLabelProps: getFieldLabelProps, getInputProps: getFieldInputProps }) => {
              return (
                <Fragment>
                  <Label
                    {...this.getLabelProps(getFieldLabelProps())}
                    dangerouslySetInnerHTML={{ __html: this.props.label }}
                  />
                  <StyledFauxInput
                    {...focused}
                    validation={showError ? 'error' : 'none'}
                    mediaLayout={true}
                    inputRef={container => (this.containerRef = container)}
                  >
                    <CountryDropdown
                      selectedKey={this.state.selectedKey}
                      onChange={this.onFlagChange}
                      countries={this.state.countries}
                      width={
                        this.containerRef ? this.containerRef.getBoundingClientRect().width : '100%'
                      }
                      appendToNode={this.props.getFrameContentDocument().body}
                      isOpen={this.state.countryDropdownOpen}
                      onToggleOpen={countryDropdownOpen => {
                        this.setState({ countryDropdownOpen })
                      }}
                    />
                    <StyledInput
                      {...getFieldInputProps()}
                      value={this.state.inputValue}
                      onChange={this.onInputChange}
                      type="tel"
                      name="phone"
                      autoComplete="off"
                      innerRef={node => (this.phoneInput = node)}
                      required={this.props.required}
                      bare={true}
                      data-testid="talkPhoneField--input"
                    />
                  </StyledFauxInput>
                </Fragment>
              )
            }}
          </FieldContainer>
        </ThemeProvider>
        {showError && <Message validation="error">{this.props.errorMessage}</Message>}
      </StyledContainer>
    )
  }
}

const connectedComponent = connect(mapStateToProps)(PhoneField)

export { PhoneField as Component, connectedComponent as default }
