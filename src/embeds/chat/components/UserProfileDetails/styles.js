import styled from 'styled-components'

const maxWidth = props => {
  const base = props.isSociallyAuthenticated ? 70 : 20
  const value = base / props.theme.fontSize

  return `calc(100% - ${value}rem)`
}

const UserProfileDetailsContainer = styled.div`
  display: inline-block;
  max-width: ${maxWidth};
  padding-left: ${props => 12 / props.theme.fontSize}rem;

  ${props =>
    props.theme.rtl &&
    `
    padding-left: 0;
    padding-right: ${12 / props.theme.fontSize}rem;
  `}
`

const DisplayName = styled.div`
  font-weight: bold;
`

export { UserProfileDetailsContainer, DisplayName }
