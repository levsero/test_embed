import { rem } from 'polished'
import styled from 'styled-components'
import { Avatar as GardenAvatar } from '@zendeskgarden/react-avatars'
import CloseSVG from '@zendeskgarden/svg-icons/src/16/x-fill.svg'
import dirStyles from 'src/utils/dirStyles'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  font-family: ${(props) => props.theme.messenger.fontFamily};
  padding: ${(props) => props.theme.messenger.space.sm};
  padding-${dirStyles.left}: ${(props) => props.theme.messenger.space.xs};
  background-color: ${(props) => props.theme.messenger.colors.primary};
  color: ${(props) => props.theme.messenger.colors.primaryText};
  word-break: break-word;
`

const CompactContainer = styled(Container)``

const ContentContainer = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  min-height: ${(props) => rem(40, props.theme.messenger.baseFontSize)};
  min-width: 0;
`

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  color: ${(props) => props.theme.messenger.colors.primaryText};
  min-width: 0;
  margin-bottom: ${(props) => props.theme.messenger.space.xxs};
  margin-top: ${(props) => props.theme.messenger.space.xxs};

  > div:only-child {
    margin-bottom: 0;
    margin-top: 0;
  }

  &:not(:first-child) {
    padding-${dirStyles.left}: ${(props) => props.theme.messenger.space.sixteen};
  }
`

const Avatar = styled(GardenAvatar)`
  && {
    height: ${(props) => rem(40, props.theme.messenger.baseFontSize)} !important;
    width: ${(props) => rem(40, props.theme.messenger.baseFontSize)} !important;
    margin-${dirStyles.left}: ${(props) => props.theme.messenger.space.xs};
    flex-shrink: 0;
    border-radius: 50%;
  }
`

const Title = styled.div`
  font-size: ${(props) => rem(18, props.theme.messenger.baseFontSize)};
  line-height: ${(props) => rem(24, props.theme.messenger.baseFontSize)};
  font-weight: ${(props) => props.theme.messenger.fontWeights.semibold};
  letter-spacing: ${(props) => rem(-0.45, props.theme.messenger.baseFontSize)};
`

const Description = styled.div`
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  line-height: ${(props) => props.theme.messenger.lineHeights.md};
  letter-spacing: ${(props) => rem(-0.15, props.theme.messenger.baseFontSize)};

  ${CompactContainer} & {
    text-wrap: avoid;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const CloseIcon = styled(CloseSVG)``

const HeaderControl = styled.div`
  display: flex;
  flex-direction: column;
  &:not(& + &) {
    padding-${dirStyles.left}: ${(props) => props.theme.messenger.space.sixteen};
  }

  & + & {
    margin-${dirStyles.left}: 3px;
  }
  justify-content: center;
  min-height: ${(props) => rem(32, props.theme.messenger.baseFontSize)};
`

export {
  Avatar,
  Title,
  Description,
  Container,
  ContentContainer,
  CompactContainer,
  Details,
  CloseIcon,
  HeaderControl,
}
