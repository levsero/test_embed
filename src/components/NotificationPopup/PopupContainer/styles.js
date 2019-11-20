import styled from 'styled-components'
import { isMobileBrowser } from 'utility/devices'
import { FONT_SIZE } from 'constants/shared'
import { zdColorGrey600, zdColorBlack, zdColorWhite } from '@zendeskgarden/css-variables'

import { Button } from '@zendeskgarden/react-buttons'
import { SlideAppear } from 'component/transition/SlideAppear'
import RemoveIcon from '@zendeskgarden/svg-icons/src/14/remove.svg'

export const CtaContainer = styled.div`
  padding-bottom: ${20 / FONT_SIZE}rem !important;

  ${showOnlyLeftCta =>
    showOnlyLeftCta
      ? `justify-content: center !important;
    display: flex !important;`
      : `padding-left: ${20 / FONT_SIZE}rem !important;
    padding-right: ${20 / FONT_SIZE}rem !important;`}
`

export const PopupContainerStyle = styled.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute !important;
  top: ${42.5 / FONT_SIZE}rem !important;
  z-index: 4;
  overflow: hidden;

  ${({ hide }) =>
    hide &&
    `{
    display: none;
  }`}
`

export const MobileOverlay = styled.div`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute !important;
  background-color: ${zdColorBlack};
  opacity: 0.4;
`

export const CtaButtonLeft = styled(Button)`
  ${({ showOnlyLeftCta }) =>
    showOnlyLeftCta
      ? `width: 100%;`
      : `
  overflow: hidden !important;
  width: 100% !important;
  text-overflow: ellipsis;
  max-width: calc(50% - ${26 / FONT_SIZE}rem);
  margin-left: ${20 / FONT_SIZE}rem !important;
  margin-right: ${12 / FONT_SIZE}rem !important;

  [dir='rtl'] & {
    margin-right: ${20 / FONT_SIZE}rem !important;
    margin-left: ${12 / FONT_SIZE}rem !important;
  }`}
  ${isMobileBrowser() &&
    `
    height: ${35 / FONT_SIZE}rem;
    border-radius: ${4 / FONT_SIZE}rem;`}
`

export const CtaButtonRight = styled(Button)`
  overflow: hidden !important;
  width: 100% !important;
  text-overflow: ellipsis;
  max-width: calc(50% - ${26 / FONT_SIZE}rem);
  ${isMobileBrowser() &&
    `
  height: ${35 / FONT_SIZE}rem;
  border-radius: ${4 / FONT_SIZE}rem;`}
`

export const CloseIcon = styled(RemoveIcon)`
  cursor: pointer !important;
  position: absolute !important;
  color: ${props => props.theme.baseColor};
  top: ${10 / FONT_SIZE}rem;

  [dir='ltr'] & {
    right: ${10 / FONT_SIZE}rem;
  }

  [dir='rtl'] & {
    left: ${10 / FONT_SIZE}rem;
  }

  &:hover {
    color: ${zdColorGrey600};
  }

  svg {
    min-width: ${16 / FONT_SIZE}rem;
    min-height: ${16 / FONT_SIZE}rem;
    height: ${16 / FONT_SIZE}rem;
    width: ${16 / FONT_SIZE}rem;
  }
`

export const WrapperButton = styled.button`
  border: none;
  text-align: initial;
  width: 100%;
  background: none;
`

export const MobileSlideAppear = styled(SlideAppear)`
  position: absolute !important;
  left: 0;
  right: 0;
  background-color: ${zdColorWhite};
`

const topMargin = 1.5
const chatHeaderHeight = 58 / FONT_SIZE
const roughWidgetHeaderHeight = 3

export const StyledSlideAppear = styled(SlideAppear)`
  position: absolute;
  left: 0;
  right: 0;

  z-index: 1;
  overflow-y: auto;

  max-height: calc(100% - ${roughWidgetHeaderHeight + topMargin + chatHeaderHeight}rem);

  background-color: ${zdColorWhite};
  border-radius: ${3 / FONT_SIZE}rem;
  box-shadow: 0 0 ${8 / FONT_SIZE}rem 0 rgba(0, 0, 0, 0.3);

  margin: 0 ${10 / FONT_SIZE}rem ${10 / FONT_SIZE}rem;
`

export const Container = styled.div`
  ${isMobileBrowser() && `margin: 0 ${20 / FONT_SIZE}rem;`}
`
