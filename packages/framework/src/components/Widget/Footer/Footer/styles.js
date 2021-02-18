import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  ${(props) =>
    props.justLogo &&
    `
    justify-content: center;
    align-items: center;
  `}

  ${(props) =>
    props.justChildren &&
    `
    justify-content: flex-end;
  `}
`

export { Container }
