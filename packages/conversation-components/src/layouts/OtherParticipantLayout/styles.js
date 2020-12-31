import styled from 'styled-components'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const VerticalContainer = styled.div`
  font-family: ${props => props.theme.messenger.fontFamily};
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.theme.messenger.space.sixteen};
  margin-top: ${props => (props.isFirstInGroup ? props.theme.messenger.space.sm : 0)};
`

const OtherParticipantName = styled.p`
  margin-left: ${props => props.theme.messenger.space.xxl};
  font-size: ${props => props.theme.messenger.fontSizes.sm};
  font-weight: normal;
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  color: ${props => props.theme.palette.grey[600]};
`

export { LayoutContainer, OtherParticipantName, VerticalContainer }
