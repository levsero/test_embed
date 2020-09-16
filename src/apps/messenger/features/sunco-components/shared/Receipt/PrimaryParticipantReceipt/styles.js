import styled from 'styled-components'

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${props => props.theme.messenger.space.xxxs};
  margin-right: ${props => props.theme.messenger.space.sm};
  justify-content: flex-end;
`

const Time = styled.p`
  color: ${props => props.theme.palette.grey[600]};
  font-size: ${props => props.theme.messenger.fontSizes.sm};
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  margin-right: ${props => props.theme.messenger.space.xs};
  text-align: right;
`

const Tail = styled.div`
  border-top: ${props => props.theme.messenger.space.sm} solid
    ${props => props.theme.messenger.colors.message};
  border-left: ${props => props.theme.messenger.space.sm} solid transparent;
`

export { Layout, Tail, Time }
