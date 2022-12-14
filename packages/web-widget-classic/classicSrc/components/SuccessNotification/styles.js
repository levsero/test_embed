import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled, { css } from 'styled-components'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'
import { Button } from '@zendeskgarden/react-buttons'

const Container = styled.div`
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const StyledSuccessIcon = styled.div`
  min-width: ${160 / FONT_SIZE}rem;
  width: ${160 / FONT_SIZE}rem;
  height: ${80 / FONT_SIZE}rem;
  margin-bottom: ${15 / FONT_SIZE}rem;

  ${(props) =>
    css`
      .customColor {
        fill: ${props.theme.listColorStr} !important;
      }
    `}
`

const Heading = styled.h2`
  font-weight: 700;
  color: ${(props) => props.theme.listColorStr} !important;
  fill: ${(props) => props.theme.listColorStr} !important;
  font-size: ${15 / 14}rem;
  text-align: center;

  :hover,
  :active,
  :focus {
    color: ${(props) => props.theme.listHighlightColorStr} !important;
    fill: ${(props) => props.theme.listHighlightColorStr} !important;
  }
`

const Message = styled.p`
  margin-top: ${5 / FONT_SIZE}rem;
  color: ${zdColorGrey800};
  text-align: center;
`

const LinkText = styled(Button)`
  margin-top: ${15 / FONT_SIZE}rem;
  color: ${(props) => props.theme.linkTextColorStr};
`

export { Container, StyledSuccessIcon as SuccessIcon, Heading, Message, LinkText }
