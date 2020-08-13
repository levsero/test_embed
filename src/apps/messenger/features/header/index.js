import React from 'react'
import { useSelector } from 'react-redux'
import { getCompany } from 'src/apps/messenger/store/company'
import { Title, Tagline, Container, Details, Avatar } from './styles'

const Header = () => {
  const { avatar, name, tagline } = useSelector(getCompany)

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
    </Container>
  )
}

export default Header
