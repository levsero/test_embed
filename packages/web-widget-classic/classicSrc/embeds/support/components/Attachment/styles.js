import { Icon } from 'classicSrc/component/Icon'
import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'
import { zdColorGrey100, zdColorGrey600, zdColorGrey800 } from '@zendeskgarden/css-variables'
import { Well } from '@zendeskgarden/react-notifications'

export const Description = styled.div`
  flex: 1;
`

export const PreviewName = styled.div`
  display: flex;
  color: ${zdColorGrey800};
  overflow: hidden;
`

export const AttachmentDetails = styled.div`
  display: block;
  color: ${zdColorGrey600};
`

export const Preview = styled.div`
  align-items: center !important;
  display: flex;
  min-height: ${32 / FONT_SIZE}rem;
  z-index: 2;
`

export const Container = styled(Well)`
  background-color: ${zdColorGrey100} !important;
  border-radius: ${4 / FONT_SIZE}rem;
  padding: ${10 / FONT_SIZE}rem !important;
  margin-bottom: ${10 / FONT_SIZE}rem !important;
`

export const StyledIcon = styled(Icon)`
  padding-top: 0 !important;
  margin-top: 0 !important;
  display: inline-block !important;
  max-width: 100%;
  padding-left: ${(props) => (props.theme.rtl ? `${8 / FONT_SIZE}rem` : 0)};
  padding-right: ${(props) => (props.theme.rtl ? 0 : `${8 / FONT_SIZE}rem`)};

  svg {
    min-width: ${24 / FONT_SIZE}rem;
    min-height: ${24 / FONT_SIZE}rem;
    height: ${24 / FONT_SIZE}rem;
    width: ${24 / FONT_SIZE}rem;
  }
`
