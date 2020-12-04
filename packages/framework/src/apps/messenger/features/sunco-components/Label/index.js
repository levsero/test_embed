import styled from 'styled-components'

const Label = styled.p`
  margin-left: ${props => props.theme.messenger.space.xxl};
  font-size: ${props => props.theme.messenger.fontSizes.sm};
  font-weight: normal;
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  color: ${props => props.theme.palette.grey[600]};
`

export default Label
