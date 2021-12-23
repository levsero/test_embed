import { Avatar } from 'classicSrc/component/Avatar'
import styled from 'styled-components'
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
  margin: ${(props) => 20 / props.theme.fontSize}rem;
  margin-bottom: ${(props) => 15 / props.theme.fontSize}rem;

  ${({ proactive }) =>
    !proactive &&
    `{
    margin-left: 0;

    [dir='rtl'] & {
      margin-right: 0;
    }
  }`}

  ${({ noAvatar }) => !noAvatar && `margin-top: ${(props) => 15 / props.theme.fontSize}`}
`

export const AgentName = styled.div`
  font-weight: 700;
  padding-bottom: ${(props) => 4 / props.theme.fontSize}rem;
`

export const StyledAvatar = styled(Avatar)`
  padding-left: 0 !important;
  display: inline-block !important;
  max-width: 100%;
  margin-top: ${({ proactive }) =>
    proactive
      ? `${(props) => 20 / props.theme.fontSize}rem;`
      : `${(props) => 11 / props.theme.fontSize}rem;`}
  margin-bottom: ${({ proactive }) =>
    proactive
      ? `${(props) => 20 / props.theme.fontSize}rem;`
      : `${(props) => 11 / props.theme.fontSize}rem;`}
  margin-right: ${(props) => 12 / props.theme.fontSize}rem;
  margin-left: ${(props) => 15 / props.theme.fontSize}rem;
  height: ${(props) => 36 / props.theme.fontSize}rem;
  width: ${(props) => 36 / props.theme.fontSize}rem;

  svg {
    min-height: ${(props) => 15 / props.theme.fontSize}rem;
    min-width: ${(props) => 15 / props.theme.fontSize}rem;
    height: ${(props) => 15 / props.theme.fontSize}rem;
    width: ${(props) => 15 / props.theme.fontSize}rem;
    padding-top: ${(props) => 8 / props.theme.fontSize}rem;
    padding-left: ${(props) => 0.5 / props.theme.fontSize}rem;
  }
`

export const AgentMessage = styled.div`
  position: relative !important;
  overflow: hidden !important;
  line-height: ${(props) => 18 / props.theme.fontSize}rem;
  max-height: ${(props) => 38 / props.theme.fontSize}rem;

  ${({ hasOverflow }) =>
    hasOverflow &&
    `
    margin-bottom: ${(props) => 24 / props.theme.fontSize}rem !important;
    padding: ${(props) => 8 / props.theme.fontSize}rem 0 0 0;

  &:before {
    position: absolute;
    content: '...';
    background-color: ${zdColorWhite};
    bottom: 0;
    right: 0;
    height: ${(props) => 18 / props.theme.fontSize}rem;
    width: ${(props) => 15 / props.theme.fontSize}rem;
    line-height: ${(props) => 18 / props.theme.fontSize}rem;
    padding-right: ${(props) => 2 / props.theme.fontSize}rem;
    text-align: center;
  }

  &:after {
    position: absolute;
    content: '';
    background: linear-gradient(to right, rgba(${zdColorWhite}, 0), rgba(${zdColorWhite}, 0.8));
    height: ${(props) => 18 / props.theme.fontSize}rem;
    width: 45%;
    bottom: 0;
    right: 0;
  }
  `}
`
