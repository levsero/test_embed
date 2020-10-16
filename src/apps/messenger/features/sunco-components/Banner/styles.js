import styled from 'styled-components'
import { rem } from 'polished'
import { baseFontSize } from 'src/apps/messenger/features/themeProvider'
import { BANNER_STATUS } from 'src/apps/messenger/features/sunco-components/constants'

const statusColors = {
  [BANNER_STATUS.success]: '#038153',
  [BANNER_STATUS.fatal]: '#000'
}

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  display: table;
  overflow: hidden;
  width: 90%;
  margin: 10px auto 0;
  padding: ${rem(6, baseFontSize)} ${props => props.theme.messenger.space.xs};
  text-align: center;
  z-index: 10;
  background-color: ${props => statusColors[props.status] || statusColors[BANNER_STATUS.success]};
  border-radius: ${props => props.theme.messenger.borderRadii.textMessage};
  box-shadow: 0px 1px 4px 0px rgba(71, 69, 123, 0.04), 0px 4px 12px 0px rgba(36, 36, 36, 0.1);
`

const Label = styled.label`
  display: table-cell;
  vertical-align: middle;
  color: #fff;
  height: ${rem(20, baseFontSize)};
  font-size: ${props => props.theme.messenger.fontSizes.md};
`

export { Container, Label }
