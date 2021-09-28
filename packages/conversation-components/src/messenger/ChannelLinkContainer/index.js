import { rem } from 'polished'
import styled, { css } from 'styled-components'

const ChannelLinkContainer = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding-top: ${(props) => rem(120, props.theme.messenger.baseFontSize)};
  padding-bottom: ${(props) => props.theme.messenger.space.lg};

  ${(props) =>
    props.theme.messenger.isFullScreen &&
    css`
      @media (orientation: landscape) {
        padding-top: ${rem(60, props.theme.messenger.baseFontSize)};
      }
    `}
`

export default ChannelLinkContainer
