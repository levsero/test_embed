import styled from 'styled-components'
import { zdColorGrey800, zdColorGrey400, zdColorGrey600 } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'
import { Avatar } from 'component/Avatar'

const Container = styled.div`
  display: flex;
  align-items: center;
  box-shadow: 0 ${(props) => 4 / props.theme.fontSize}rem ${(props) => 8 / props.theme.fontSize}rem
    0 rgba(0, 0, 0, 0.1);
  padding: ${(props) => `${12 / props.theme.fontSize}rem ${16 / props.theme.fontSize}rem`};
  z-index: 3;
  flex-shrink: 0;
`

const AgentInfo = styled.div`
  display: flex;
  flex: 1;
  border: none;
  text-align: left;
  background: none;
  min-width: 0;
  ${(props) => props.clickable && `cursor: pointer`};
  ${(props) => props.theme.rtl && `text-align: right;`}
`

const Overflow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: ${(props) => 34 / props.theme.fontSize}rem;
  width: ${(props) => 34 / props.theme.fontSize}rem;
  border: ${zdColorGrey400} ${(props) => 2 / props.theme.fontSize}rem solid;
`

const OverflowText = styled.div`
  color: ${zdColorGrey600};
`

const Text = styled.div`
  color: ${zdColorGrey800};
  line-height: ${16 / FONT_SIZE}rem;
  padding-top: ${1 / FONT_SIZE}rem;
  flex: 1;
  min-width: 0;
  ${(props) => {
    if (!props.showTitle) return { visibility: 'hidden' }

    if (!props.showAvatar) {
      return null
    }

    return props.theme.rtl ? { paddingRight: '12px' } : { paddingLeft: '12px' }
  }}
`

const StyledAvatar = styled(Avatar)``

const TooltipWrapper = styled.div`
  > div {
    display: block;
  }
`

const Title = styled.h2`
  font-weight: 700;
  font-size: ${14 / FONT_SIZE}rem;
  width: 100%;
  /* The below lines are required for the line clamping and ellipsis on overflow */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

const Subtext = styled.div`
  width: 100%;
  margin-top: ${1 / FONT_SIZE}rem;

  /* The below lines are required for the line clamping and ellipsis on overflow */
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`

const AvatarContainer = styled.div`
  align-self: center;
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  ${StyledAvatar}, ${Overflow} {
    box-sizing: border-box;
    box-shadow: 0 0 0 ${(props) => 2 / props.theme.fontSize}rem white;
    max-width: none;

    svg {
      padding-left: ${(props) => 0.5 / props.theme.fontSize}rem;
    }
  }
`

export {
  Container,
  AgentInfo,
  AvatarContainer,
  Overflow,
  OverflowText,
  Subtext,
  Text,
  Title,
  StyledAvatar as Avatar,
  TooltipWrapper,
}
