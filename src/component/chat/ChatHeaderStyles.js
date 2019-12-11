import styled from 'styled-components'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'

const Text = styled.div`
  color: ${zdColorGrey800};
  line-height: ${16 / FONT_SIZE}rem;
  padding-top: ${1 / FONT_SIZE}rem;
  ${props => {
    if (!props.showTitle) return { visibility: 'hidden' }

    if (!props.showAvatar) {
      return null
    }

    return props.theme.rtl ? { paddingRight: '12px' } : { paddingLeft: '12px' }
  }}
`

const Title = styled.h2`
  font-weight: 700;
  font-size: ${14 / FONT_SIZE}rem;
  width: 100%;
  max-height: ${16 / FONT_SIZE}rem;
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
  max-height: ${32 / FONT_SIZE}rem;
  max-width: ${170 / FONT_SIZE}rem;
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
  align-items: center;
`

export { AvatarContainer, Subtext, Text, Title }
