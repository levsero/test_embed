import styled from 'styled-components'
import { zdColorGrey600, zdColorBlue600 } from '@zendeskgarden/css-variables'
import Icon from 'src/embeds/answerBot/icons/article.svg'

const Header = styled.div`
  ${props => {
    return `
      display: flex !important;
      align-items: center !important;
      margin-bottom: ${8 / props.theme.fontSize}rem;
      overflow: hidden;
    `
  }}
`

const Snippet = styled.div`
  ${props => {
    return `
      display: flex !important;
      color: ${zdColorGrey600};
      overflow: hidden;
      max-height: ${35 / props.theme.fontSize}rem;
    `
  }}
`

const Title = styled.div`
  color: ${zdColorBlue600};

  &:hover {
    text-decoration: underline;
  }
`

const Container = styled.div`
  ${props => {
    return `
      display: flex !important;
      padding: ${12 / props.theme.fontSize}rem ${14 / props.theme.fontSize}rem;
      flex-direction: column;
    `
  }}
`

const ArticleIcon = styled(Icon)`
  ${props => {
    return `
      ${props.theme.rtl ? 'margin-left' : 'margin-right'}: ${10 / props.theme.fontSize}rem;

      min-width: ${14 / props.theme.fontSize}rem !important;
      width: ${14 / props.theme.fontSize}rem !important;
      height: ${14 / props.theme.fontSize}rem !important;

      path {
        stroke: ${zdColorGrey600} !important;
      }
    `
  }}
`

export { Header, Snippet, Title, Container, ArticleIcon }
