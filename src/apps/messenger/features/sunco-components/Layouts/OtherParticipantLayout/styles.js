import styled from 'styled-components'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const VerticalContainer = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  padding: 0 ${props => props.theme.messenger.space.md};
  margin-top: ${props => (props.isFirstInGroup ? props.theme.messenger.space.sm : 0)};
  width: 100%;
`

const OtherParticipantName = styled.p`
  margin-left: ${props => props.theme.messenger.space.xxl};
  font-size: ${props => props.theme.messenger.fontSizes.sm};
  font-weight: normal;
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  color: ${props => props.theme.palette.grey[600]};
`

export { LayoutContainer, OtherParticipantName, VerticalContainer }
