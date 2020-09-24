import styled from 'styled-components'

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${props => props.theme.messenger.space.xxxs};
  margin-left: calc(
    ${props => props.theme.messenger.iconSizes.xl} + ${props => props.theme.messenger.space.md}
  );
  justify-content: flex-start;
`

const Time = styled.p`
  color: ${props => props.theme.palette.grey[600]};
  font-size: ${props => props.theme.messenger.fontSizes.sm};
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  margin-left: ${props => props.theme.messenger.space.xs};
  text-align: left;
`

const Tail = styled.div`
  border-top: ${props => props.theme.messenger.space.sm} solid
    ${props => props.theme.messenger.colors.otherParticipantMessage};
  border-right: ${props => props.theme.messenger.space.sm} solid transparent;
`

export { Layout, Tail, Time }
