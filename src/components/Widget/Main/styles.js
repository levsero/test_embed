import styled from 'styled-components'
import { zdColorGrey300 } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'

const Container = styled.div`
  flex-grow: 2;
  margin-left: ${10 / FONT_SIZE}rem;
  margin-right: ${10 / FONT_SIZE}rem;
  padding-top: ${15 / FONT_SIZE}rem;
  overflow-y: auto;
  overflow-x: hidden;
  padding-left: ${10 / FONT_SIZE}rem;
  padding-right: ${10 / FONT_SIZE}rem;
  height: 100%;

  /*
   * Customise scrollbar for safari/chrome
   */
  &::-webkit-scrollbar-track {
    margin: ${15 / FONT_SIZE} 0;
  }
  &::-webkit-scrollbar {
    box-shadow: none;
    width: ${3 / FONT_SIZE}rem;
  }
  &::-webkit-scrollbar-thumb {
    background: ${zdColorGrey300};
    border-radius: ${3 / FONT_SIZE}rem;
  }
`

export { Container }
