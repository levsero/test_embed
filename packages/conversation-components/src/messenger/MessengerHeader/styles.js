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
  padding: ${(props) => props.theme.messenger.space.sixteen};
  background-color: ${(props) => props.theme.messenger.colors.primary};
  color: ${(props) => props.theme.messenger.colors.primaryText};
  word-break: break-word;
`

const CompactContainer = styled(Container)``

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  color: ${(props) => props.theme.messenger.colors.primaryText};
  min-width: 0;

  &:not(:first-child) {
    padding-${dirStyles.left}: ${(props) => props.theme.messenger.space.sixteen};
  }
`

const Avatar = styled(GardenAvatar)`
  && {
    height: ${(props) => rem(36, props.theme.messenger.baseFontSize)} !important;
    width: ${(props) => rem(36, props.theme.messenger.baseFontSize)} !important;
    flex-shrink: 0;
    border-radius: 50%;
    margin-top: ${(props) => rem(4, props.theme.messenger.baseFontSize)} !important;
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
  height: ${(props) => props.theme.messenger.space.xxl};
`

export {
  Avatar,
  Title,
  Description,
  Container,
  CompactContainer,
  Details,
  CloseIcon,
  HeaderControl,
}
