import React from 'react'
import { fireEvent } from '@testing-library/react'

import wait from 'utility/wait'
import { render } from 'src/util/testHelpers'
import FeedbackForm from '../'
import { TEST_IDS } from 'constants/shared'
import { ratings } from 'embeds/chat/components/RatingGroup'

describe('FeedbackForm', () => {
  const defaultRating = { value: null, disableEndScreen: false, comment: null }

  const defaultProps = {
    rating: defaultRating,
    secondaryButtonText: 'Cancel',
    submitForm: () => {}
  }

  const renderComponent = props => render(<FeedbackForm {...defaultProps} {...props} />)

  it('renders rating buttons', () => {
    const { queryByTestId } = renderComponent()

    expect(queryByTestId(TEST_IDS.ICON_THUMB_UP)).toBeInTheDocument()
    expect(queryByTestId(TEST_IDS.ICON_THUMB_DOWN)).toBeInTheDocument()
  })

  it('renders the Send button', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Send')).toBeInTheDocument()
  })

  it('renders the Cancel button', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Cancel')).toBeInTheDocument()
  })

  it('renders the Comment prompt', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Leave a comment (optional)')).toBeInTheDocument()
  })

  it('renders the Rating prompt', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Please rate this chat')).toBeInTheDocument()
  })

  it('calls submitForm when Send is clicked', async () => {
    const submitForm = jest.fn()
    const { getByText } = renderComponent({
      submitForm: submitForm,
      rating: { value: ratings.NOT_SET, comment: 'chat was good' }
    })

    fireEvent.click(getByText('Send'))

    await wait()

    expect(submitForm).toHaveBeenCalledWith(null, 'chat was good')
  })

  it('Send button is disabled when form is empty', async () => {
    const { queryByTestId } = renderComponent({
      rating: { value: ratings.NOT_SET, comment: null }
    })

    expect(queryByTestId(TEST_IDS.BUTTON_OK)).toBeDisabled()
  })
})
