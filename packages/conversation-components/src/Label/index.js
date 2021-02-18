import styled from 'styled-components'
import dirStyles from 'src/utils/dirStyles'

const Label = styled.p`
  margin: 0;
  margin-${dirStyles.left}: ${(props) => props.theme.messenger.space.xxl};
  font-size: ${(props) => props.theme.messenger.fontSizes.sm};
  font-weight: normal;
  line-height: ${(props) => props.theme.messenger.lineHeights.sm};
  color: ${(props) => props.theme.palette.grey[600]};
`

export default Label
