import { render, fireEvent, queryByAltText } from '@testing-library/react'
import * as libphonenumber from 'libphonenumber-js'
import { Component as PhoneField } from '../'
import snapshotDiff from 'snapshot-diff'
import { IdManager } from '@zendeskgarden/react-selection'
import countriesByIso from 'translation/ze_countries'

jest.mock('libphonenumber-js')

import { TEST_IDS } from 'src/constants/shared'

describe('PhoneField', () => {
  const mockFormattedValue = '+61412 345 678'

  const defaultProps = {
    label: 'Phone field label',
    supportedCountries: ['AU', 'US'],
    value: '+61412345678',
    showError: false,
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
      const { queryByTestId } = renderComponent({ country: 'US' })

      expect(queryByAltText(queryByTestId(TEST_IDS.DROPDOWN_FIELD), 'US')).toBeInTheDocument()
    })

    it('uses the the first supportedCountry when country not provided', () => {
      const { queryByTestId } = renderComponent({ country: null })

      expect(
        queryByAltText(queryByTestId(TEST_IDS.DROPDOWN_FIELD), defaultProps.supportedCountries[0])
      ).toBeInTheDocument()
    })
  })

  it('focuses the input when dropdown is open', () => {
    const withOpenDropdown = renderComponent()

    fireEvent.click(withOpenDropdown.queryByTestId(TEST_IDS.DROPDOWN_FIELD))

    const withClosedDropdown = renderComponent()

    expect(
      snapshotDiff(withClosedDropdown, withOpenDropdown, { contextLines: 0 })
    ).toMatchSnapshot()
  })

  describe('text field', () => {
    it('initialises to the prop "value" formatted if provided', () => {
      libphonenumber.AsYouType.mockImplementation(() => ({ input: () => mockFormattedValue }))

      const { queryByTestId } = renderComponent()

      expect(queryByTestId(TEST_IDS.PHONE_FIELD)).toHaveValue(mockFormattedValue)
    })

    it('initialises to the current countries number code when prop "value" is not provided', () => {
      const { queryByTestId } = renderComponent({
        value: null,
        country: 'AU',
      })

      expect(queryByTestId(TEST_IDS.PHONE_FIELD)).toHaveValue(`+${countriesByIso.AU.code}`)
    })

    it('replaces "-" with spaces when displaying a country code', () => {
      const { queryByTestId } = renderComponent({
        value: null,
        country: 'BB',
      })

      const expectedCountryCode = countriesByIso.BB.code.replace('-', ' ')

      expect(queryByTestId(TEST_IDS.PHONE_FIELD)).toHaveValue(`+${expectedCountryCode}`)
    })
  })

  it('calls onCountrySelect when country changes', () => {
    const onCountrySelect = jest.fn()
    const { queryByText, queryByTestId } = renderComponent({ onCountrySelect })

    queryByTestId(TEST_IDS.DROPDOWN_FIELD).click()

    queryByText('United States (+1)').click()

    expect(onCountrySelect).toHaveBeenCalledWith('US')
  })
})
