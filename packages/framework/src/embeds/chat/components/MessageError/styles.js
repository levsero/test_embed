import styled from 'styled-components'
import { zdColorRed500 } from '@zendeskgarden/css-variables'
import { Alert } from '@zendeskgarden/react-notifications'

export const Container = styled(Alert)`
  margin-bottom: $spacing-tny;
  display: inline-block;
  float: ${(props) => (props.theme.rtl ? 'left' : 'right')};
  &&& {
    background-color: transparent;
    color: ${zdColorRed500};
    background-position: ${(props) => 14 / props.theme.fontSize}rem
      ${(props) => 3 / props.theme.fontSize}rem;
    border: none;
    font-size: ${(props) => 14 / props.theme.fontSize}rem;
    padding-bottom: ${(props) => 12 / props.theme.fontSize}rem;
    padding-top: 0;
    background-size: ${(props) => 14 / props.theme.fontSize}rem;
    ${(props) => (props.theme.rtl ? 'padding-left' : 'padding-right')}: 0rem;
    ${(props) => (props.theme.rtl ? 'padding-right' : 'padding-left')}: ${(props) =>
      42 / props.theme.fontSize}rem;
  }
`

export const ErrorSpan = styled.span`
  display: inline-block;
  line-height: #{18 / $font-size}rem;
  max-width: calc(
    ${(props) => 202 / props.theme.fontSize}rem - ${(props) => 19 / props.theme.fontSize}rem
  );
`

export const ErrorButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  margin: 0;
  padding: 0;
  color: ${zdColorRed500};
  cursor: pointer;
  text-decoration: underline;

  &:hover,
  &:focus,
  &:active {
    color: ${zdColorRed500};
  }

  line-height: ${(props) => 18 / props.theme.fontSize}rem;
  max-width: calc(
    ${(props) => 202 / props.theme.fontSize}rem - ${(props) => 19 / props.theme.fontSize}rem
  );
`
