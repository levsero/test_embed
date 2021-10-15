import PropTypes from 'prop-types'
import useLabels from 'src/hooks/useLabels'
import {
  Avatar,
  ContentContainer,
  Description,
  Details,
  Title,
} from 'src/messenger/MessengerHeader/styles'

const Content = ({ title, description, avatar }) => {
  const labels = useLabels().messengerHeader

  return (
    <ContentContainer>
      {avatar && (
        <Avatar isSystem={true}>
          <img src={avatar} alt={labels.avatarAltTag} />
        </Avatar>
      )}
      <Details>
        {title && <Title>{title}</Title>}
        {description && <Description>{description}</Description>}
      </Details>
    </ContentContainer>
  )
}

Content.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  avatar: PropTypes.string,
}

export default Content
