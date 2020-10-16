import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getHeaderValues } from './store'
import { widgetClosed } from 'src/apps/messenger/store/visibility'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'

import {
  Title,
  Description,
  Container,
  Details,
  Avatar,
  IconButton,
  CloseIcon,
  CloseIconContainer
} from './styles'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'

const Header = () => {
  const dispatch = useDispatch()
  const { avatar, name, description } = useSelector(getHeaderValues)
  const isLauncherVisible = useSelector(getIsLauncherVisible)
  const isFullScreen = useSelector(getIsFullScreen)

  return (
    <Container isFullScreen={isFullScreen}>
      {avatar && (
        <Avatar isSystem={true} isFullScreen={isFullScreen}>
          <img src={avatar} alt={'company avatar'} />
        </Avatar>
      )}
      <Details>
        {name && <Title isFullScreen={isFullScreen}>{name}</Title>}
        {description && <Description isFullScreen={isFullScreen}>{description}</Description>}
      </Details>

      {!isLauncherVisible && (
        <CloseIconContainer isFullScreen={isFullScreen}>
          <IconButton
            isFullScreen={isFullScreen}
            onClick={() => {
              dispatch(widgetClosed())
            }}
            aria-label="Close messenger"
          >
            <CloseIcon />
          </IconButton>
        </CloseIconContainer>
      )}
    </Container>
  )
}

export default Header
