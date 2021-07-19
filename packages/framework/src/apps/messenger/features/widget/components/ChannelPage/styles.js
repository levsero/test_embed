import styled from 'styled-components'
import { rem } from 'polished'

const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
`

const Header = styled.div`
  position: fixed;
  left: ${(props) => props.theme.messenger.space.sm};
  top: ${(props) => props.theme.messenger.space.xs};
`

// Semantically, should this be <main>?
const Body = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-direction: column;
`

const Title = styled.h1`
  font-size: ${(props) => props.theme.messenger.fontSizes.lg};
  line-height: ${(props) => props.theme.messenger.lineHeights.lg};
  margin-bottom: ${(props) => props.theme.messenger.space.xs};
`

const Subtitle = styled.p`
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  line-height: ${(props) => props.theme.messenger.lineHeights.md};
  margin-bottom: ${(props) => props.theme.messenger.space.md};
  max-width: ${(props) => rem(300, props.theme.baseFontSize)};
`

const ChannelIcon = styled.div`
  height: ${(props) => props.theme.messenger.iconSizes.xl};
  width: ${(props) => props.theme.messenger.iconSizes.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.messenger.space.md};

  svg,
  img {
    height: ${(props) => props.theme.messenger.iconSizes.xl};
    width: ${(props) => props.theme.messenger.iconSizes.xl};
  }
`

export { Container, Body, Header, Title, Subtitle, ChannelIcon }
