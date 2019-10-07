import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { FONT_SIZE } from 'constants/shared'

const FooterView = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledButton = styled(Button)`
  margin-bottom: ${13 / FONT_SIZE}rem !important;
`

export { StyledButton as Button, FooterView }
