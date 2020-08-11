import React from 'react'
import { useSelector } from 'react-redux'
import { getCompany } from 'src/apps/messenger/store/company'
import { Avatar, Title, Tagline, Container, Details } from './styles'

const Header = () => {
  const { avatar, name, tagline } = useSelector(getCompany)

  return (
    <Container>
      {avatar && <Avatar src={avatar} alt={'company avatar'} />}
      <Details>
        {name && <Title>{name}</Title>}
        {tagline && <Tagline>{tagline}</Tagline>}
      </Details>
    </Container>
  )
}

export default Header
