import { rem } from 'polished'
import styled, { css } from 'styled-components'

const ChannelLinkContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => rem(120, props.theme.messenger.baseFontSize)};
  margin-bottom: ${(props) => props.theme.messenger.space.lg};

  ${(props) =>
    props.theme.messenger.isFullScreen &&
    css`
      @media (orientation: landscape) {
        margin-top: ${rem(60, props.theme.messenger.baseFontSize)};
      }
    `}
`

export default ChannelLinkContainer
