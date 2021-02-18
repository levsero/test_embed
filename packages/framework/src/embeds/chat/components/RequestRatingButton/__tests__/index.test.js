import React from 'react'
import { render } from 'src/util/testHelpers'

import { Component as RequestRatingButton } from '../'

describe('RequestRatingButton', () => {
  const defaultProps = {
    onClick: jest.fn(),
    eventKey: 1,
    isChatting: true,
    canRateChat: true,
    latestRating: -1,
    latestRatingRequest: -1,
    latestAgentLeaveEvent: -1,
    activeAgentCount: 1,
    chatRating: { value: undefined, comment: null },
  }

  const renderComponent = (props = {}) =>
    render(<RequestRatingButton {...defaultProps} {...props} />)

  describe('when an agent requests a rating', () => {
    it('gives the user the option to submit a rating when an agent requests a rating', () => {
      const { queryByText } = renderComponent({ latestRatingRequest: 1, latestRating: 1 })

      expect(queryByText('Rate this chat')).toBeInTheDocument()
    })

    it('does not give the user the option to submit a rating when the Chat account settings prevent rating an agent', () => {
      const { queryByText } = renderComponent({
        canRateChat: false,
        latestRatingRequest: 1,
        latestRating: 1,
      })

      expect(queryByText('Rate this chat')).not.toBeInTheDocument()
      expect(queryByText('Leave a comment')).not.toBeInTheDocument()
    })
  })

  describe('when the user submits a rating', () => {
    it('does not give the user the option to submit a rating if a rating is submitted with a comment', () => {
      const { queryByText } = renderComponent({
        latestRating: 1,
        chatRating: {
          value: 'good',
          comment: 'cool comment',
        },
      })

      expect(queryByText('Rate this chat')).not.toBeInTheDocument()
      expect(queryByText('Leave a comment')).not.toBeInTheDocument()
    })

    it('gives the user the option to leave a comment if they gave a rating without a comment', () => {
      const { queryByText } = renderComponent({
        latestRating: 1,
        chatRating: {
          value: 'good',
          comment: null,
        },
      })

      expect(queryByText('Rate this chat')).not.toBeInTheDocument()
      expect(queryByText('Leave a comment')).toBeInTheDocument()
    })
  })

  describe('when an agent leaves the chat', () => {
    it('gives the user the option to submit a rating if there are no remaining agents in the chat', () => {
      const { queryByText } = renderComponent({ latestAgentLeaveEvent: 1, activeAgentCount: 0 })

      expect(queryByText('Rate this chat')).toBeInTheDocument()
      expect(queryByText('Leave a comment')).not.toBeInTheDocument()
    })

    it('does not gives the user the option to submit a rating if there are remaining agents in the chat', () => {
      const { queryByText } = renderComponent({ latestAgentLeaveEvent: 1, activeAgentCount: 1 })

      expect(queryByText('Rate this chat')).not.toBeInTheDocument()
      expect(queryByText('Leave a comment')).not.toBeInTheDocument()
    })
  })
})
