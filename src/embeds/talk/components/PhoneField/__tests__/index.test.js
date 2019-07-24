import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Component as PhoneField } from '../'
import snapshotDiff from 'snapshot-diff'
import { IdManager } from '@zendeskgarden/react-selection'
import countriesByIso from 'translation/ze_countries'

describe('PhoneField', () => {
  const mockFormattedValue = '+61412 345 678'

  const asYouTypeInput = jest.fn().mockReturnValue(mockFormattedValue)

  const defaultProps = {
    label: 'Phone field label',
    supportedCountries: ['AU', 'US'],
    libphonenumber: {
      AsYouType: jest.fn().mockImplementation(() => ({ input: asYouTypeInput })),
      isValidNumber: jest.fn()
    },
    value: '+61412345678',
    errorMessage: 'Field is invalid',
    showError: false
  }

  const renderComponent = (props = {}) => {
    IdManager.setIdCounter(0)
    return render(<PhoneField {...defaultProps} {...props} />)
  }

  it('displays a label', () => {
    const { queryByText } = renderComponent()

    expect(queryByText(defaultProps.label)).toBeInTheDocument()
  })

  describe('default country selection', () => {
    it('uses the country prop when provided', () => {
      const { queryByAltText } = renderComponent({ country: 'US' })

      expect(queryByAltText('US')).toBeInTheDocument()
    })

    it('uses the the first supportedCountry when country not provided', () => {
      const { queryByAltText } = renderComponent({ country: null })

      expect(queryByAltText(defaultProps.supportedCountries[0])).toBeInTheDocument()
    })
  })

  it('focuses the input when dropdown is open', () => {
    const withOpenDropdown = renderComponent()

    fireEvent.click(withOpenDropdown.queryByTestId('countryDropdown--select'))

    const withClosedDropdown = renderComponent()

    expect(
      snapshotDiff(withClosedDropdown, withOpenDropdown, { contextLines: 0 })
    ).toMatchSnapshot()
  })

  describe('text field', () => {
    it('initialises to the prop "value" formatted if provided', () => {
      const { queryByTestId } = renderComponent()

      expect(queryByTestId('talkPhoneField--input')).toHaveValue(mockFormattedValue)
    })

    it('initialises to the current countries number code when prop "value" is not provided', () => {
      const { queryByTestId } = renderComponent({
        value: null,
        country: 'AU'
      })

      expect(queryByTestId('talkPhoneField--input')).toHaveValue(`+${countriesByIso.AU.code}`)
    })

    it('replaces "-" with spaces when displaying a country code', () => {
      const { queryByTestId } = renderComponent({
        value: null,
        country: 'BB'
      })

      const expectedCountryCode = countriesByIso.BB.code.replace('-', ' ')

      expect(queryByTestId('talkPhoneField--input')).toHaveValue(`+${expectedCountryCode}`)
    })
  })

  describe('error message', () => {
    describe('showError is false', () => {
      it('does not render error message when field is valid', () => {
        defaultProps.libphonenumber.isValidNumber.mockReturnValue(true)

        const { queryByText } = renderComponent({ showError: false })

        expect(queryByText(defaultProps.errorMessage)).not.toBeInTheDocument()
      })

      it('does not render error message when field is invalid', () => {
        defaultProps.libphonenumber.isValidNumber.mockReturnValue(false)

        const { queryByText } = renderComponent({ showError: false })

        expect(queryByText(defaultProps.errorMessage)).not.toBeInTheDocument()
      })
    })

    describe('showError is true', () => {
      it('does not render error message when field is valid', () => {
        defaultProps.libphonenumber.isValidNumber.mockReturnValue(true)

        const { queryByText } = renderComponent({ showError: true })

        expect(queryByText(defaultProps.errorMessage)).not.toBeInTheDocument()
      })

      it('renders error message when field is invalid', () => {
        defaultProps.libphonenumber.isValidNumber.mockReturnValue(false)

        const { queryByText } = renderComponent({ showError: true })

        expect(queryByText(defaultProps.errorMessage)).toBeInTheDocument()
      })
    })
  })

  it('calls onCountrySelect when country changes', () => {
    const onCountrySelect = jest.fn()
    const { queryByText, queryByTestId } = renderComponent({ onCountrySelect })

    queryByTestId('countryDropdown--select').click()

    queryByText('United States (+1)').click()

    expect(onCountrySelect).toHaveBeenCalledWith('US')
  })
})
