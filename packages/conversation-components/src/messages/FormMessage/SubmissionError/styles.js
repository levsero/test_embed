import styled from 'styled-components'
import AlertError from '@zendeskgarden/svg-icons/src/16/alert-error-stroke.svg'

const ErrorIcon = styled(AlertError)`
  margin-right: ${props => props.theme.messenger.space.xs};
  &&& {
    width: ${props => props.theme.messenger.iconSizes.sm};
    height: ${props => props.theme.messenger.iconSizes.sm};
  }
`

const Alert = styled.div`
  height: ${props => props.theme.messenger.lineHeights.sm};
  font-size: ${props => props.theme.messenger.fontSizes.sm};
  color: ${props => props.theme.palette.red['600']};
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  margin-left: calc(
    ${props => props.theme.messenger.space.xxl} + ${props => props.theme.messenger.space.md}
  );
  margin-top: ${props => props.theme.messenger.space.xs};
`

export { ErrorIcon, Alert }
