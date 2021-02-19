import { render } from 'src/util/testHelpers'
import RatingGroup from 'src/embeds/chat/components/RatingGroup'
import { fireEvent } from '@testing-library/react'
import { TEST_IDS } from 'constants/shared'

describe('RatingGroup', () => {
  const updateRatingFunction = jest.fn()

  const defaultProps = {
    updateRating: updateRatingFunction,
    rating: null,
  }

  it('renders ratings', () => {
    const { queryByTestId, container } = render(<RatingGroup {...defaultProps} />)
    expect(container.querySelectorAll('svg').length).toBe(2)
    expect(queryByTestId(TEST_IDS.ICON_THUMB_UP)).toBeInTheDocument()
    expect(queryByTestId(TEST_IDS.ICON_THUMB_DOWN)).toBeInTheDocument()
  })

  it('calls the updateRating function when rating buttons are clicked', () => {
    const { queryByTestId } = render(<RatingGroup {...defaultProps} />)
    fireEvent.click(queryByTestId(TEST_IDS.ICON_THUMB_UP))
    expect(updateRatingFunction).toHaveBeenCalledTimes(1)
    fireEvent.click(queryByTestId(TEST_IDS.ICON_THUMB_DOWN))
    expect(updateRatingFunction).toHaveBeenCalledTimes(2)
  })
})
