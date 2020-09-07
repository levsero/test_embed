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

const Header = () => {
  const dispatch = useDispatch()
  const { avatar, name, description } = useSelector(getHeaderValues)
  const isLauncherVisible = useSelector(getIsLauncherVisible)

  return (
    <Container>
      {avatar && (
        <Avatar isSystem={true}>
          <img src={avatar} alt={'company avatar'} />
        </Avatar>
      )}
      <Details>
        {name && <Title>{name}</Title>}
        {description && <Description>{description}</Description>}
      </Details>

      {!isLauncherVisible && (
        <CloseIconContainer>
          <IconButton
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
