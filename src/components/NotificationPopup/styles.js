import styled from 'styled-components'
import { Avatar } from 'component/Avatar'

import { FONT_SIZE } from 'constants/shared'
import { zdColorGrey800, zdColorWhite } from '@zendeskgarden/css-variables'

export const ProactiveContainer = styled.div`
  color: ${zdColorGrey800};
  display: flex !important;
  align-items: center !important;
`

export const AgentContainerStyle = styled.div`
  display: inline-block !important;
  max-width: 100%;
  width: auto;
  margin: ${20 / FONT_SIZE}rem;
  margin-bottom: ${15 / FONT_SIZE}rem;

  ${({ proactive }) =>
    !proactive &&
    `{
    margin-left: 0;

    [dir='rtl'] & {
      margin-right: 0;
    }
  }`}

  ${({ noAvatar }) => !noAvatar && `margin-top: ${15 / FONT_SIZE}`}
`

export const AgentName = styled.div`
  font-weight: 700;
  padding-bottom: ${4 / FONT_SIZE}rem;
`

export const StyledAvatar = styled(Avatar)`
  padding-left: 0 !important;
  display: inline-block !important;
  max-width: 100%;
  margin-top: ${({ proactive }) => (proactive ? `${20 / FONT_SIZE}rem;` : `${11 / FONT_SIZE}rem;`)}
  margin-bottom: ${({ proactive }) =>
    proactive ? `${20 / FONT_SIZE}rem;` : `${11 / FONT_SIZE}rem;`}
  margin-right: ${12 / FONT_SIZE}rem;
  margin-left: ${15 / FONT_SIZE}rem;
  height: ${36 / FONT_SIZE}rem;
  width: ${36 / FONT_SIZE}rem;

  svg {
    min-height: ${15 / FONT_SIZE}rem;
    min-width: ${15 / FONT_SIZE}rem;
    height: ${15 / FONT_SIZE}rem;
    width: ${15 / FONT_SIZE}rem;
    padding-top: ${8 / FONT_SIZE}rem;
    padding-left: ${0.5 / FONT_SIZE}rem;
  }
`

export const AgentMessage = styled.div`
  position: relative !important;
  overflow: hidden !important;
  line-height: ${18 / FONT_SIZE}rem;
  max-height: ${44 / FONT_SIZE}rem;

  ${({ hasOverflow }) =>
    hasOverflow &&
    `
    margin-bottom: 1rem !important;
    padding: ${8 / FONT_SIZE}rem 0 0 0;

  &:before {
    position: absolute;
    content: '...';
    background-color: ${zdColorWhite};
    bottom: 0;
    right: 0;
    height: ${18 / FONT_SIZE}rem;
    width: ${15 / FONT_SIZE}rem;
    line-height: ${18 / FONT_SIZE}rem;
    padding-right: ${2 / FONT_SIZE}rem;
    text-align: center;
  }

  &:after {
    position: absolute;
    content: '';
    background: linear-gradient(to right, rgba(${zdColorWhite}, 0), rgba(${zdColorWhite}, 0.8));
    height: ${18 / FONT_SIZE}rem;
    width: 45%;
    bottom: 0;
    right: 0;
  }
  `}
`
