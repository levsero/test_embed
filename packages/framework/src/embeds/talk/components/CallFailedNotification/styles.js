import styled from 'styled-components'
import { zdColorRed600 } from '@zendeskgarden/css-variables'
import { Title } from '@zendeskgarden/react-notifications'

const NotificationTitle = styled(Title)`
  color: ${zdColorRed600} !important;
`

export { NotificationTitle as Title }
