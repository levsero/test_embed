import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import NestedDropdown from '../'
import { ThemeProvider } from 'styled-components'
import { TEST_IDS } from 'src/constants/shared'

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js')

  return class {
    static placements = PopperJS.placements

    constructor() {
      return {
        destroy: () => {},
        scheduleUpdate: () => {},
        enableEventListeners: () => {},
        disableEventListeners: () => {}
      }
    }
  }
})

const mockOptions = [
  {
    name: 'pizzaName',
    value: 'pizza'
  },
  {
    name: 'ice cream',
    value: 'ice cream'
  },
  {
    name: 'ice',
    value: 'ice'
  },
  {
    name: 'fruits::apple', // "::" refers to a level delimiter so "fruits::apple" means that there should be an "apples" option in the second level after selecting "fruits" in the first level.
    value: 'fruits__apple',
    default: true
  },
  {
    name: 'fruits::banana',
    value: 'fruits__banana'
  },
  {
    name: 'vegetable::carrot',
    value: 'vegetable__carrot'
  },
  {
    name: 'vegetable',
    value: 'vegetable'
  }
]

const renderComponent = props => {
  const defaultProps = {
    options: mockOptions,
    required: false,
    label: <div>dropdown label</div>
  }
  const mergedProps = {
    ...defaultProps,
    ...props
  }

  return render(
    <ThemeProvider theme={{}}>
      <NestedDropdown {...mergedProps} />
    </ThemeProvider>
  )
}

const testOptionsShown = (expectedOptions, options) => {
  expectedOptions.forEach((expectedOption, i) => {
    expect(options[i].innerHTML).toEqual(expectedOption)
  })
}

describe('NestedDropdown', () => {
  describe('when required', () => {
    it('render options without "-" (no selection) option in the first level', () => {
      const { getAllByRole } = renderComponent({
        required: true
      })

      const currentOptions = getAllByRole('option')

      expect(currentOptions.length).toEqual(5)
      testOptionsShown(['pizzaName', 'ice cream', 'ice', 'fruits', 'vegetable'], currentOptions)
    })

    describe('when nested fruits chosen', () => {
      it('render options with no "-" in the second level', () => {
        const { getAllByRole, queryByText } = renderComponent({
          required: true
        })

        fireEvent.click(queryByText('fruits'))

        const currentOptions = getAllByRole('option')

        expect(currentOptions.length).toEqual(3)
        testOptionsShown(['fruits', 'apple', 'banana'], currentOptions)
      })
    })

    describe('when nested vegetables chosen', () => {
      it('render options without "-" (no selection) in the second level', () => {
        const { getAllByRole, queryByText } = renderComponent({
          required: true
        })

        fireEvent.click(queryByText('vegetable'))

        const currentOptions = getAllByRole('option')
        expect(currentOptions.length).toEqual(2)
        testOptionsShown(['vegetable', 'carrot'], currentOptions)
      })
    })
  })

  describe('when no initial value provided', () => {
    it('renders no default value', () => {
      const { getByTestId } = renderComponent()

      const dropdownDisplaySelectedValue = getByTestId(TEST_IDS.DROPDOWN_FIELD)
      const dropdownInput = getByTestId(TEST_IDS.DROPDOWN_SELECTED_VALUE)

      expect(dropdownDisplaySelectedValue.textContent).toEqual('-')
      expect(dropdownInput.textContent).toEqual('')
    })
  })

  describe('when initial value provided', () => {
    it('renders the default value', () => {
      const { getByTestId } = renderComponent({
        defaultOption: { name: 'pizzaName', value: 'pizza' }
      })

      const dropdownDisplaySelectedValue = getByTestId(TEST_IDS.DROPDOWN_FIELD)
      const dropdownInput = getByTestId(TEST_IDS.DROPDOWN_SELECTED_VALUE)

      expect(dropdownDisplaySelectedValue.textContent).toEqual('pizzaName')
      expect(dropdownInput.value).toEqual('pizza')
    })
  })

  describe('when there is an error', () => {
    it('shows an error', () => {
      const { queryByText } = renderComponent({
        showError: true
      })

      expect(queryByText('Please select a value.')).toBeInTheDocument()
    })
  })

  describe('when not required', () => {
    it('render "-" (no selection) option in the first level', () => {
      const { getAllByRole } = renderComponent({
        required: false
      })

      const currentOptions = getAllByRole('option')

      expect(currentOptions.length).toEqual(6)
      testOptionsShown(
        ['-', 'pizzaName', 'ice cream', 'ice', 'fruits', 'vegetable'],
        currentOptions
      )
    })
  })

  describe('when selecting options on the first level', () => {
    it('selects and displays the clicked value', () => {
      const { getByTestId, queryByText } = renderComponent({
        required: true
      })
      fireEvent.click(queryByText('pizzaName'))

      const dropdownDisplaySelectedValue = getByTestId(TEST_IDS.DROPDOWN_FIELD)
      const dropdownInput = getByTestId(TEST_IDS.DROPDOWN_SELECTED_VALUE)

      expect(dropdownDisplaySelectedValue.textContent).toEqual('pizzaName')
      expect(dropdownInput.value).toEqual('pizza')
    })
  })

  describe('when selecting options on the second level', () => {
    it('selects and displays the clicked value', () => {
      const { getByTestId, queryByText } = renderComponent({
        required: true
      })

      fireEvent.click(queryByText('vegetable')) // Select next level
      fireEvent.click(queryByText('carrot'))

      const dropdownDisplaySelectedValue = getByTestId(TEST_IDS.DROPDOWN_FIELD)
      const dropdownInput = getByTestId(TEST_IDS.DROPDOWN_SELECTED_VALUE)

      expect(dropdownDisplaySelectedValue.textContent).toEqual('carrot')
      expect(dropdownInput.value).toEqual('vegetable__carrot')
    })
  })

  describe('when moving back to original level', () => {
    it('shows the first level', () => {
      const { getAllByRole, queryByText } = renderComponent({
        required: true
      })

      fireEvent.click(queryByText('fruits')) // Select next level
      fireEvent.click(queryByText('fruits')) // Go back

      const currentOptions = getAllByRole('option')

      expect(currentOptions.length).toEqual(6)
      testOptionsShown(
        ['-', 'pizzaName', 'ice cream', 'ice', 'fruits', 'vegetable'],
        currentOptions
      )
    })
  })
})
