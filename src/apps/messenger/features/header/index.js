import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCompany } from 'src/apps/messenger/store/company'
import { Title, Tagline, Container, Details, Avatar } from './styles'
import { widgetClosed } from 'src/apps/messenger/store/visibility'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'

const Header = () => {
  const dispatch = useDispatch()
  const { avatar, name, tagline } = useSelector(getCompany)
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
        {tagline && <Tagline>{tagline}</Tagline>}
      </Details>

      {!isLauncherVisible && (
        <button
          onClick={() => {
            dispatch(widgetClosed())
          }}
        >
          Close
        </button>
      )}
    </Container>
  )
}

export default Header
