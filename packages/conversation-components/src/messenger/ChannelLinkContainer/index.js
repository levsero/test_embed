import { rem } from 'polished'
import styled, { css } from 'styled-components'

const ChannelLinkContainer = styled.div`
  margin-top: ${(props) => rem(120, props.theme.messenger.baseFontSize)};

  ${(props) =>
    props.theme.messenger.isFullScreen &&
    css`
      @media (orientation: landscape) {
        margin-top: ${(props) => rem(60, props.theme.messenger.baseFontSize)};
      }
    `}
`

export default ChannelLinkContainer
