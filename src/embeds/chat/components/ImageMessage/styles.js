import styled from 'styled-components'
import { zdColorGrey200, zdColorGrey300, zdColorGrey500 } from '@zendeskgarden/css-variables'

import { Spinner } from '@zendeskgarden/react-loaders'

const StyledSpinner = styled(Spinner)`
  color: ${zdColorGrey500} !important;
`

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${zdColorGrey200};
  border: ${props => 1 / props.theme.fontSize}rem solid ${zdColorGrey300};
  border-radius: ${props => 8 / props.theme.fontSize}rem;
  width: ${props => 150 / props.theme.fontSize}rem;
  height: ${props => 113 / props.theme.fontSize}rem;
`

const StyledImage = styled.img`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${zdColorGrey200};
  border: ${props => 1 / props.theme.fontSize}rem solid ${zdColorGrey300};
  border-radius: ${props => 8 / props.theme.fontSize}rem;
  background-position: center;
  background-size: cover;
  width: ${props => 150 / props.theme.fontSize}rem;
  height: ${props => 113 / props.theme.fontSize}rem;
`

const Link = styled.a`
  &:hover,
  &:active,
  &:focus {
    text-decoration: none !important;
  }
`

export { StyledSpinner as Spinner, ImageContainer, Link, StyledImage }
