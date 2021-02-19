import { render } from '@testing-library/react'
import Flag from '../'

describe('Flag', () => {
  it('positions the sprite correctly for the given flag', () => {
    const { queryByAltText } = render(<Flag country="AU" />)

    expect(getComputedStyle(queryByAltText('AU')).getPropertyValue('background-position')).toBe(
      '0% 5.416667%'
    )
  })

  it('uses the country code in lower case as the alt value', () => {
    const { queryByAltText } = render(<Flag country="EN" />)

    expect(queryByAltText('EN')).toBeInTheDocument()
  })
})
