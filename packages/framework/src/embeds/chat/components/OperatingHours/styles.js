import styled from 'styled-components'
import { Button as GardenButton } from '@zendeskgarden/react-buttons'

const Title = styled.div`
  font-size: ${props => 15 / props.theme.fontSize}rem;

  span {
    font-weight: normal;
  }
`

const Button = styled(GardenButton)`
  max-width: 100%;
  width: 100%;
  && {
    margin-bottom: ${props => 16 / props.theme.fontSize}rem;
  }
`

export { Title, Button }
