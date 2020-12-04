import styled from 'styled-components'

export const Container = styled.div`
  ${props => `padding: 0 ${10 / props.theme.fontSize}rem ${5 / props.theme.fontSize}rem;`}
`
