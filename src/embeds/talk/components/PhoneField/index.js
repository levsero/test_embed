import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Field, Message, Label } from '@zendeskgarden/react-forms'
import {
  FieldContainer,
  composeEventHandlers,
  ControlledComponent
} from '@zendeskgarden/react-selection'
import { ThemeProvider } from '@zendeskgarden/react-theming'
import { TEST_IDS } from 'constants/shared'
import { i18n } from 'service/i18n'
import countriesByIso from 'translation/ze_countries'
import CountryDropdown from 'src/embeds/talk/components/CountryDropdown'
import { getLibPhoneNumberVendor } from 'src/redux/modules/talk/talk-selectors'
import { getStyledLabelText } from 'utility/fields'
import { getWebWidgetFrameContentDocumentBody } from 'utility/globals'
import styleOverrides from './styles.overrides'
import { Container, FauxInput, Input } from './styles'
import { onNextTick } from 'src/util/utils'

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
      AsYouType: PropTypes.func
    }).isRequired,
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
    onNextTick(() => this.phoneInput.focus())

    this.props.onCountrySelect(selectedKey)
  }

  formatCountries(supportedCountries) {
    return supportedCountries
      .map(iso => this.getCountryByIso(iso))
      .sort((a, b) => {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0 // eslint-disable-line no-nested-ternary
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

  getErrorMessage(phoneValue, selectedKey) {
    const { parsePhoneNumber } = this.props.libphonenumber

    try {
      parsePhoneNumber(phoneValue, selectedKey)
    } catch (error) {
      return error.message
    }
  }

  validatePhoneNumber = (phoneValue, selectedKey) => {
    const errorMessage = this.getErrorMessage(phoneValue, selectedKey)
    if (errorMessage) {
      this.setState({ valid: false })
      this.phoneInput.setCustomValidity('Error')
      return errorMessage
    } else {
      this.phoneInput.setCustomValidity('')
      this.setState({ valid: true })
    }
  }

  getPhoneValue = (inputValue, selectedKey) => {
    const { code } = this.getCountryByIso(selectedKey)

    return !_.startsWith(inputValue, code) ? code : this.formatPhoneNumber(selectedKey, inputValue)
  }

  onInputChange = e => {
    const phoneValue = this.getPhoneValue(e.target.value, this.state.selectedKey)

    const errorMessage = this.validatePhoneNumber(phoneValue, this.state.selectedKey)
    if (errorMessage !== 'TOO_LONG') {
      this.setState({ inputValue: phoneValue })
    }
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
    this.validatePhoneNumber(this.state.inputValue, this.state.selectedKey)
  }

  render() {
    // prop is applied this way as we only want to control it
    // when the select is focused. Otherwise omit and let the component
    // control its focus state
    const focused = this.state.countryDropdownOpen ? { focused: true } : {}
    const showError = this.props.showError && !this.state.valid

    return (
      <Container>
        <ThemeProvider
          rtl={this.props.rtl}
          document={getWebWidgetFrameContentDocumentBody()}
          theme={styleOverrides}
        >
          <FieldContainer>
            {({ getLabelProps: getFieldLabelProps, getInputProps: getFieldInputProps }) => {
              return (
                <Field>
                  <Label
                    {...this.getLabelProps(getFieldLabelProps())}
                    dangerouslySetInnerHTML={{ __html: this.props.label }}
                  />
                  <FauxInput
                    {...focused}
                    validation={showError ? 'error' : undefined}
                    mediaLayout={true}
                    ref={container => {
                      if (!container) {
                        return
                      }

                      this.containerRef = container

                      if (!this.state.dropdownWidth) {
                        this.setState({
                          dropdownWidth: this.containerRef.getBoundingClientRect().width || '100%'
                        })
                      }
                    }}
                  >
                    <CountryDropdown
                      selectedKey={this.state.selectedKey}
                      onChange={this.onFlagChange}
                      countries={this.state.countries}
                      width={this.state.dropdownWidth || '100%'}
                      appendToNode={getWebWidgetFrameContentDocumentBody()}
                      isOpen={this.state.countryDropdownOpen}
                      onToggleOpen={countryDropdownOpen => {
                        this.setState({ countryDropdownOpen })
                      }}
                    />
                    <Input
                      {...getFieldInputProps()}
                      value={this.state.inputValue}
                      onChange={this.onInputChange}
                      type="tel"
                      name="phone"
                      autoComplete="off"
                      ref={node => (this.phoneInput = node)}
                      required={this.props.required}
                      bare={true}
                      data-testid={TEST_IDS.PHONE_FIELD}
                    />
                  </FauxInput>
                </Field>
              )
            }}
          </FieldContainer>
        </ThemeProvider>
        {showError && <Message validation="error">{this.props.errorMessage}</Message>}
      </Container>
    )
  }
}

const connectedComponent = connect(mapStateToProps)(PhoneField)

export { PhoneField as Component, connectedComponent as default }
