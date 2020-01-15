import styled from 'styled-components'
import { zdColorGrey800, zdColorWhite } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'constants/shared'
import { SlideAppear } from 'component/transition/SlideAppear'
import { isMobileBrowser } from 'utility/devices'

const Backdrop = styled.div`
  background: ${() => (isMobileBrowser() ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0)')};
  position: fixed;
  top: ${() => (isMobileBrowser() ? `${42.5 / FONT_SIZE}rem` : 0)};
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: ${() => (isMobileBrowser() ? 'flex-start' : 'flex-end')};
  z-index: 4;
  padding-bottom: 20px;
  overflow: hidden;
`

const Header = styled.h4`
  color: ${zdColorGrey800};
  margin-bottom: ${16 / FONT_SIZE}rem;
  text-align: center;
  font-size: ${15 / FONT_SIZE}rem;
`

const ModalActions = styled.div`
  display: flex;
  margin-top: ${16 / FONT_SIZE}rem;

  > * {
    flex: 1;
  }

  > *:not(:first-child) {
    margin-left: ${12 / FONT_SIZE}rem;
  }
`

const StyledSlideAppear = styled(SlideAppear)`
  width: ${() => (isMobileBrowser() ? 100 : 90)}%;
  max-height: calc(100% - 4.5rem);
  overflow-y: scroll;
  padding: 20px;
  background: ${zdColorWhite};
  position: relative;
  background-color: ${zdColorWhite};
  border-radius: ${3 / FONT_SIZE}rem;
  box-shadow: 0rem 0rem ${8 / FONT_SIZE}rem 0rem rgba(0, 0, 0, 0.3);
  margin-bottom: ${15 / FONT_SIZE}rem;
`

export { Backdrop, Header, ModalActions, StyledSlideAppear as SlideAppear }
