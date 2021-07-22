import { fireEvent } from '@testing-library/react'
import { TEST_IDS } from 'src/constants/shared'
import { ratings } from 'src/embeds/chat/components/RatingGroup'
import { render } from 'src/util/testHelpers'
import FeedbackForm from '../'

describe('FeedbackForm', () => {
  const defaultRating = { value: null, disableEndScreen: false, comment: null }

  const defaultProps = {
    rating: defaultRating,
    secondaryButtonText: 'Cancel',
    submitForm: () => {},
  }

  const renderComponent = (props) => render(<FeedbackForm {...defaultProps} {...props} />)

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

  it('calls submitForm when Send is clicked and rating is set', async () => {
    const submitForm = jest.fn()
    const { getByText } = renderComponent({
      submitForm: submitForm,
      rating: { value: ratings.GOOD, comment: null },
    })

    fireEvent.click(getByText('Send'))

    expect(submitForm).toHaveBeenCalledWith('good', null)
  })

  it('calls submitForm when Send is clicked and comment is set', async () => {
    const submitForm = jest.fn()
    const { getByText } = renderComponent({
      submitForm: submitForm,
      rating: { value: ratings.NOT_SET, comment: 'chat was good' },
    })

    fireEvent.click(getByText('Send'))

    expect(submitForm).toHaveBeenCalledWith(null, 'chat was good')
  })

  it('calls submitForm when Send is clicked and both rating and comment is set', async () => {
    const submitForm = jest.fn()
    const { getByText } = renderComponent({
      submitForm: submitForm,
      rating: { value: ratings.BAD, comment: 'chat was bad' },
    })

    fireEvent.click(getByText('Send'))

    expect(submitForm).toHaveBeenCalledWith(ratings.BAD, 'chat was bad')
  })

  it('renders an error when an empty form is submitted', async () => {
    const submitForm = jest.fn()
    const { getByText, rerender } = renderComponent({
      submitForm: submitForm,
      rating: { value: ratings.NOT_SET, comment: null },
    })

    fireEvent.click(getByText('Send'))

    renderComponent(
      {
        submitForm: submitForm,
        rating: { value: ratings.NOT_SET, comment: null },
      },
      rerender
    )

    expect(getByText('Add a rating or comment')).toBeInTheDocument()
  })

  it('does not call the onsubmit function when an empty form is submitted', async () => {
    const submitForm = jest.fn()
    const { getByText, rerender } = renderComponent({
      submitForm: submitForm,
      rating: { value: ratings.NOT_SET, comment: null },
    })

    fireEvent.click(getByText('Send'))

    renderComponent(
      {
        submitForm: submitForm,
        rating: { value: ratings.NOT_SET, comment: null },
      },
      rerender
    )

    expect(submitForm).not.toHaveBeenCalled()
  })
})
