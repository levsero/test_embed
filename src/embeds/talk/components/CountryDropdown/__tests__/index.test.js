import React from 'react'
import { act, render, queryByTestId } from '@testing-library/react'
import CountryDropdown from '../'

describe('CountryDropdown', () => {
  const defaultProps = {
    appendToNode: document.createElement('div'),
    selectedKey: 'australia',
    onChange: jest.fn(),
    countries: [
      {
        code: '+61',
        iso: 'AU',
        name: 'Australia'
      },
      {
        code: '+1',
        iso: 'US',
        name: 'America'
      }
    ],
    width: '100px',
    isOpen: false,
    onToggleOpen: jest.fn()
  }

  beforeEach(() => {
    defaultProps.appendToNode = document.createElement('div')

    document.body.appendChild(defaultProps.appendToNode)
  })

  const renderComponent = (props = {}) => render(<CountryDropdown {...defaultProps} {...props} />)

  it('renders an option for each country', () => {
    const { queryByText } = renderComponent({ isOpen: true })

    expect(queryByText('Australia (+61)')).toBeInTheDocument()
    expect(queryByText('America (+1)')).toBeInTheDocument()
  })

  it('calls onChange when a country is selected', () => {
    const onChange = jest.fn()

    const { queryByText } = renderComponent({
      isOpen: true,
      onChange
    })

    act(() => {
      queryByText('America (+1)').click()
    })

    expect(onChange).toHaveBeenCalledWith('US')
  })

  it('displays the flag of the current selected country', () => {
    const { queryByAltText } = renderComponent()

    expect(queryByAltText(defaultProps.selectedKey)).toBeInTheDocument()
  })

  it('styles the dropdown wiith the provided width', () => {
    const { queryByTestId } = renderComponent({ isOpen: true })

    expect(queryByTestId('countryDropdown--dropdown').style.width).toBe(defaultProps.width)
  })

  it('renders the dropdown in the provided appendToNode', () => {
    renderComponent({ isOpen: true })

    expect(
      queryByTestId(defaultProps.appendToNode, 'countryDropdown--dropdown')
    ).toBeInTheDocument()
  })

  it('calls onToggleOpen when opened', () => {
    const onToggleOpen = jest.fn()
    const { queryByTestId } = renderComponent({
      isOpen: true,
      onToggleOpen
    })

    act(() => {
      queryByTestId('countryDropdown--select').click()
    })

    expect(onToggleOpen).toHaveBeenCalledWith(false)
  })

  it('calls onToggleOpen when closed', () => {
    const onToggleOpen = jest.fn()
    const { queryByTestId } = renderComponent({
      isOpen: false,
      onToggleOpen
    })

    act(() => {
      queryByTestId('countryDropdown--select').click()
    })

    expect(onToggleOpen).toHaveBeenCalledWith(true)
  })
})
