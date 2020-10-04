import React from 'react'
import PropTypes from 'prop-types'
import {
  CenterSpinnerContainer,
  TopSpinnerContainer,
  CenterLoadingErrorTitle,
  CenterLoadingErrorContainer,
  CenterLoadingErrorDescription,
  TopLoadingErrorContainer,
  LoadingErrorButton
} from './styles'
import { Spinner } from '@zendeskgarden/react-loaders'
import ReloadStroke from '@zendeskgarden/svg-icons/src/12/reload-stroke.svg'

const HistoryLoader = ({
  hasFetchedConversation,
  isFetchingHistory,
  errorFetchingHistory,
  retryFetchMessages
}) => {
  return (
    <>
      {hasFetchedConversation && isFetchingHistory && (
        <TopSpinnerContainer>
          <Spinner />
        </TopSpinnerContainer>
      )}

      {!hasFetchedConversation && isFetchingHistory && (
        <CenterSpinnerContainer>
          <Spinner />
        </CenterSpinnerContainer>
      )}

      {errorFetchingHistory && hasFetchedConversation && !isFetchingHistory && (
        <TopLoadingErrorContainer>
          <LoadingErrorButton isLink={true} onClick={retryFetchMessages}>
            Click to retry <ReloadStroke />
          </LoadingErrorButton>
        </TopLoadingErrorContainer>
      )}

      {errorFetchingHistory && !hasFetchedConversation && (
        <CenterLoadingErrorContainer>
          <CenterLoadingErrorTitle>Messages failed to load</CenterLoadingErrorTitle>
          <LoadingErrorButton isLink={true} onClick={retryFetchMessages}>
            <CenterLoadingErrorDescription>
              Click to retry <ReloadStroke />
            </CenterLoadingErrorDescription>
          </LoadingErrorButton>
        </CenterLoadingErrorContainer>
      )}
    </>
  )
}

HistoryLoader.propTypes = {
  hasFetchedConversation: PropTypes.bool.isRequired,
  isFetchingHistory: PropTypes.bool.isRequired,
  errorFetchingHistory: PropTypes.bool.isRequired,
  retryFetchMessages: PropTypes.func.isRequired
}

export default HistoryLoader
