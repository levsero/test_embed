import styled from 'styled-components'
import { rem } from 'polished'
import { BANNER_STATUS } from '../constants'

const statusColors = {
  [BANNER_STATUS.success]: '#038153',
  [BANNER_STATUS.fatal]: 'yellow',
}

const Container = styled.div`
  font-family: ${(props) => props.theme.messenger.fontFamily};
  position: absolute;
  left: 0;
  right: 0;
  display: table-cell;
  overflow: hidden;
  width: 90%;
  margin: 10px auto 0;
  padding: ${(props) => rem(6, props.theme.messenger.baseFontSize)}
    ${(props) => props.theme.messenger.space.xs};
  text-align: center;
  z-index: 10;
  background-color: ${(props) => statusColors[props.status] || statusColors[BANNER_STATUS.success]};
  border-radius: ${(props) => props.theme.messenger.borderRadii.textMessage};
  box-shadow: 0px 1px 4px 0px rgba(71, 69, 123, 0.04), 0px 4px 12px 0px rgba(36, 36, 36, 0.1);
`

const Label = styled.label`
  text-align: center;
  vertical-align: middle;
  color: #fff;
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
`

export { Container, Label }
