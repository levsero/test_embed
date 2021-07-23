import styled from 'styled-components'
import { zdColorGrey800, zdColorWhite } from '@zendeskgarden/css-variables'
import { isMobileBrowser } from 'src/util/devices'
import { isPopout } from 'src/util/globals'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  color: ${zdColorGrey800};
  height: 100%;
  width: 100%;
  max-width: 100vw;
  position: relative;
  overflow: hidden;
  background-color: ${zdColorWhite};
  box-shadow: 0 0 ${(props) => 6 / props.theme.fontSize}rem 0 rgba(0, 0, 0, 0.2);
  border-radius: ${(props) =>
    isMobileBrowser() || isPopout() ? 'none' : `${8 / props.theme.fontSize}rem`};
`

export { Container }
