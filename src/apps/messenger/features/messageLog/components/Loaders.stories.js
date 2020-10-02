import React from 'react'
import { Container, CenterSpinnerContainer, TopSpinnerContainer } from './styles'
import { Spinner } from '@zendeskgarden/react-loaders'
import ReloadStroke from '@zendeskgarden/svg-icons/src/16/reload-stroke.svg'

import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
export default {
  title: 'Sunco/Loaders',
  component: Replies
}

const Template = args => (
  <div>
    {args.topSpinner && (
      <TopSpinnerContainer>
        <Spinner />
      </TopSpinnerContainer>
    )}

    {args.centerSpinner && (
      <CenterSpinnerContainer>
        <Spinner />
      </CenterSpinnerContainer>
    )}

    {args.centerRetry && (
      <CenterSpinnerContainer>
        <div>Messages failed to load</div>
        <div>
          Click to retry <ReloadStroke />
        </div>
      </CenterSpinnerContainer>
    )}

    {args.topRetry && (
      <TopSpinnerContainer>
        Messages failed to load <ReloadStroke />
      </TopSpinnerContainer>
    )}
  </div>
)

export const TwoReplies = Template.bind()
TwoReplies.args = {
  centerSpinner: false,
  topSpinner: false,
  topRetry: false,
  centerRetry: false
}
