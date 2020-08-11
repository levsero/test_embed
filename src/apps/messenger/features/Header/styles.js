import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 0;
  background: rgb(23, 73, 77);
  padding: 16px;
  color: white;
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: auto;
  line-height: 24px;
  padding-left: 16px;
`

const Avatar = styled.img`
  height: 48px;
  width: 48px;
`

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
`

const Tagline = styled.div`
  font-size: 16px;
`

export { Avatar, Title, Tagline, Container, Details }
